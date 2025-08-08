export interface StoredClip {
  id: string;
  name: string;
  duration: number;
  createdAt: Date;
  fileSize: number;
  mimeType: string;
  thumbnail?: string; // base64 data URL
  tags?: string[];
  description?: string;
}

export interface ClipBlob {
  id: string;
  blob: Blob;
}

class ClipStorage {
  private dbName = 'NayaClipsDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('Creating IndexedDB stores...');

        // Store for clip metadata
        if (!db.objectStoreNames.contains('clips')) {
          const clipStore = db.createObjectStore('clips', { keyPath: 'id' });
          clipStore.createIndex('name', 'name', { unique: false });
          clipStore.createIndex('createdAt', 'createdAt', { unique: false });
          clipStore.createIndex('duration', 'duration', { unique: false });
        }

        // Store for clip blobs (separate for performance)
        if (!db.objectStoreNames.contains('clipBlobs')) {
          db.createObjectStore('clipBlobs', { keyPath: 'id' });
        }
      };
    });
  }

  async saveClip(clipData: {
    name: string;
    duration: number;
    blob: Blob;
    thumbnail?: string;
    tags?: string[];
    description?: string;
  }): Promise<string> {
    if (!this.db) {
      await this.init();
    }

    const id = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const clipMetadata: StoredClip = {
      id,
      name: clipData.name,
      duration: clipData.duration,
      createdAt: now,
      fileSize: clipData.blob.size,
      mimeType: clipData.blob.type,
      thumbnail: clipData.thumbnail,
      tags: clipData.tags || [],
      description: clipData.description || ''
    };

    const clipBlob: ClipBlob = {
      id,
      blob: clipData.blob
    };

    try {
      // Save metadata
      await this.saveToStore('clips', clipMetadata);
      // Save blob data
      await this.saveToStore('clipBlobs', clipBlob);
      
      console.log('Clip saved successfully:', id);
      return id;
    } catch (error) {
      console.error('Failed to save clip:', error);
      throw error;
    }
  }

  async getClip(id: string): Promise<{ metadata: StoredClip; blob: Blob } | null> {
    if (!this.db) {
      await this.init();
    }

    try {
      const metadata = await this.getFromStore<StoredClip>('clips', id);
      const clipBlob = await this.getFromStore<ClipBlob>('clipBlobs', id);

      if (!metadata || !clipBlob) {
        return null;
      }

      return {
        metadata,
        blob: clipBlob.blob
      };
    } catch (error) {
      console.error('Failed to get clip:', error);
      return null;
    }
  }

  async getAllClips(): Promise<StoredClip[]> {
    if (!this.db) {
      await this.init();
    }

    try {
      const clips = await this.getAllFromStore<StoredClip>('clips');
      // Sort by creation date (newest first)
      return clips.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Failed to get all clips:', error);
      return [];
    }
  }

  async deleteClip(id: string): Promise<boolean> {
    if (!this.db) {
      await this.init();
    }

    try {
      await this.deleteFromStore('clips', id);
      await this.deleteFromStore('clipBlobs', id);
      console.log('Clip deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Failed to delete clip:', error);
      return false;
    }
  }

  async updateClipMetadata(id: string, updates: Partial<StoredClip>): Promise<boolean> {
    if (!this.db) {
      await this.init();
    }

    try {
      const existing = await this.getFromStore<StoredClip>('clips', id);
      if (!existing) {
        throw new Error('Clip not found');
      }

      const updated = { ...existing, ...updates, id }; // Ensure ID doesn't change
      await this.saveToStore('clips', updated);
      console.log('Clip metadata updated:', id);
      return true;
    } catch (error) {
      console.error('Failed to update clip metadata:', error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{
    totalClips: number;
    totalSize: number;
    oldestClip?: Date;
    newestClip?: Date;
  }> {
    const clips = await this.getAllClips();
    
    return {
      totalClips: clips.length,
      totalSize: clips.reduce((total, clip) => total + clip.fileSize, 0),
      oldestClip: clips.length > 0 ? clips[clips.length - 1].createdAt : undefined,
      newestClip: clips.length > 0 ? clips[0].createdAt : undefined
    };
  }

  // Helper methods
  private saveToStore<T>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private getFromStore<T>(storeName: string, id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private getAllFromStore<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private deleteFromStore(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const clipStorage = new ClipStorage();

// Utility functions
export const generateThumbnail = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }

    video.onloadeddata = () => {
      // Set canvas size
      canvas.width = 160;
      canvas.height = 120;

      // Seek to 1 second or 10% of duration
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      
      // Cleanup
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video for thumbnail'));
    };

    // Load video
    video.src = URL.createObjectURL(blob);
    video.load();
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};