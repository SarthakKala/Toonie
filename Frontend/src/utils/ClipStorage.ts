interface ClipMetadata {
  id: string;
  name: string;
  duration: number;
  createdAt: Date;
  type: 'animation' | 'audio' | 'text';
  content: string;
  thumbnail?: string;
}

interface StoredClip {
  metadata: ClipMetadata;
  blob: Blob;
}

class ClipStorage {
  private dbName = 'VideoClipsDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create clips store
        if (!db.objectStoreNames.contains('clips')) {
          const clipsStore = db.createObjectStore('clips', { keyPath: 'metadata.id' });
          clipsStore.createIndex('name', 'metadata.name', { unique: false });
          clipsStore.createIndex('type', 'metadata.type', { unique: false });
          clipsStore.createIndex('createdAt', 'metadata.createdAt', { unique: false });
        }
      };
    });
  }

  async saveClip(clipData: { blob: Blob; name: string; duration: number; type?: 'animation' | 'audio' | 'text'; content?: string }): Promise<string> {
    if (!this.db) await this.init();
    
    const id = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const metadata: ClipMetadata = {
      id,
      name: clipData.name,
      duration: clipData.duration,
      createdAt: new Date(),
      type: clipData.type || 'animation',
      content: clipData.content || '',
    };

    // Generate thumbnail (optional)
    if (clipData.blob.type.startsWith('video/')) {
      try {
        metadata.thumbnail = await this.generateThumbnail(clipData.blob);
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error);
      }
    }

    const storedClip: StoredClip = {
      metadata,
      blob: clipData.blob
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clips'], 'readwrite');
      const store = transaction.objectStore('clips');
      const request = store.add(storedClip);
      
      request.onsuccess = () => {
        console.log('Clip saved successfully:', id);
        resolve(id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getClip(id: string): Promise<StoredClip | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clips'], 'readonly');
      const store = transaction.objectStore('clips');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllClips(): Promise<StoredClip[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clips'], 'readonly');
      const store = transaction.objectStore('clips');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

    async getStorageInfo() {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clips'], 'readonly');
      const store = transaction.objectStore('clips');
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        resolve({
          dbName: this.dbName,
          version: this.version,
          clipCount: countRequest.result
        });
      };
      countRequest.onerror = () => reject(countRequest.error);
    });
  }

  async deleteClip(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['clips'], 'readwrite');
      const store = transaction.objectStore('clips');
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log('Clip deleted:', id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async generateThumbnail(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }
      
      video.onloadedmetadata = () => {
        canvas.width = 120;
        canvas.height = 90;
        
        video.currentTime = Math.min(1, video.duration / 2); // Seek to middle or 1 second
      };
      
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(video.src);
        resolve(thumbnail);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video'));
      };
      
      video.src = URL.createObjectURL(blob);
      video.muted = true;
    });
  }
}

export const clipStorage = new ClipStorage();