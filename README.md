# Toonie: AI-Powered 2D Animator & Video Composer

Toonie is an interactive platform that lets users create, preview, and compose generative p5.js animations using natural language prompts and AI assistance. Users can chat with the AI, generate code, record animation clips, and assemble them into a timeline for export as a single video.

---

## Features

- **Prompt-to-Animation:** Enter a description; the AI generates p5.js code and a live preview.
- **Contextual Chat:** Ask questions about p5.js, animation, or coding; get relevant answers.
- **Clip Recording:** Save animated segments as reusable video clips.
- **Video Editor:** Arrange clips on a timeline, drag & drop, and export a composite animation.
- **Code Transparency:** View, edit, and download all generated code.

---

## Project Structure

```
repo/
├── Frontend/   # React + Vite client app
├── Backend/    # NestJS API server
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd repo
```

### 2. Install Dependencies

#### Frontend

```sh
cd Frontend
npm install
```

#### Backend

```sh
cd ../Backend
npm install
```

### 3. Configure Environment Variables

Create `.env` files in both `Frontend/` and `Backend/` directories.  
You can use the following dummy templates:

#### Frontend/.env.example

```
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
```

#### Backend/.env.example

```
PORT=3000
FRONTEND_URL="http://localhost:5173"

OPENROUTER_API_KEY="your-openrouter-api-key-here"
```

Copy these files to `.env` and fill in any required secrets (such as your OpenRouter API key for LLM access).

### 4. Run the Project

#### Start Backend

```sh
cd Backend
npm run start:dev
```

#### Start Frontend

```sh
cd ../Frontend
npm run dev
```

- Frontend will run on [http://localhost:5173](http://localhost:5173)
- Backend will run on [http://localhost:3000](http://localhost:3000)

---

## How the Project Functions

1. **Landing Page:**  
   Users enter a prompt or use `/animate` to request an animation. The AI backend generates p5.js code, which is displayed and previewed.

2. **Dashboard:**  
   After code generation, users access the dashboard to view, edit, and run code. The live preview shows the animation in real time.

3. **Chat & Context:**  
   Users can chat with the AI for help or new animations. Non-relevant queries are filtered with friendly error messages.

4. **Clip Recording:**  
   Users record the animation preview as video clips, which are saved locally.

5. **Video Editor:**  
   Saved clips can be added to a timeline, reordered, and exported as a single composite animation.

6. **Export:**  
   The final video can be downloaded for sharing or further editing.

---

## Contributing

Pull requests and suggestions are welcome! Please open issues for bugs or feature requests.
