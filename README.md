# Note Listener 🎙️🧠

**Turn your mental chaos into structured Notion notes with the power of AI.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-v28+-informational)
![React](https://img.shields.io/badge/React-v18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5+-blue)

**Note Listener** is a modern, high-performance desktop application built with **Electron** and **React** designed to capture thoughts, ideas, and tasks using your voice. It leverages advanced AI models (all configurable) to transcribe, summarize, categorize, and tag your audio notes before automatically syncing them to your **Notion** database.

---

## ✨ Key Features

- **🎙️ Versatile Recording Options**: 
  - **Web Speech API**: Unlimited, real-time transcription (requires internet).
  - **OpenAI Whisper**: Studio-quality transcription for handling complex audio (requires API key).
- **🧠 Intelligent AI Processing**:
  - Seamlessly integrates with **OpenAI (GPT-4o/Mini)**, **Anthropic (Claude 3.5)**, and **Google (Gemini 1.5)**.
  - Automatically generates a **Title**, **Category**, **Tags**, and a structured **Summary** from your raw audio.
- **🌍 Multi-Language Support**:
  - Configure the AI to output summaries in English, Portuguese, Spanish, French, German, and more.
  - Supports automatic language detection for input.
- **📝 Automatic Notion Sync**:
  - Sends processed notes directly to your Notion Database.
  - Auto-maps properties: `Hour`, `Name`, `Category`, and `Tags`.
- **🎨 Premium User Experience**:
  - Beautiful glassmorphic design with ambient animations.
  - Fully optimized Dark Mode.
  - Responsive, intuitive, and distraction-free interface.

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following:

1.  **Node.js**: Version 18 or higher is required. [Download Node.js](https://nodejs.org/)
2.  **Notion Integration**:
    - Go to [Notion Developers](https://www.notion.so/my-integrations) and create a new internal integration.
    - Copy your **Internal Integration Token**.
    - Create a Database in Notion with these properties:
        - `Hour` (Date)
        - `Name` (Title)
        - `Category` (Select)
        - `Tags` (Multi-select)
    - **Crucial Step**: Click the `...` menu on your Notion Database page, select `Connect to`, and choose your new integration.
3.  **AI API Keys**:
    - Get an API key from at least one provider:
        - [OpenAI API Keys](https://platform.openai.com/api-keys)
        - [Anthropic Console](https://console.anthropic.com/)
        - [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Erick-Zanetti/note-listener.git
    cd note-listener
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run electron:dev
    ```

4.  **Build for Production** (Optional):
    To create an executable file (exe/dmg/AppImage):
    ```bash
    npm run electron:build
    ```
    The output will be in the `release` or `dist` folder.

---

## ⚙️ Configuration Guide

Upon first launch, you will need to configure the application:

1.  Click the **Settings** (gear icon) in the top right corner.
2.  **AI Configuration**:
    - **Default Provider**: Choose between OpenAI, Anthropic, or Google.
    - **Output Language**: Select the language you want your notes to be summarized in (e.g., English, Portuguese).
    - **System Prompt**: (Advanced) Customize how the AI interprets your speech.
3.  **Transcription Settings**:
    - **Browser**: Free, uses Chrome/Edge built-in speech recognition. Good for quick notes.
    - **Whisper**: Paid (via OpenAI), extremely accurate. Best for long, messy streams of consciousness.
4.  **API Keys**:
    - Input the keys for the services you plan to use. Keys are stored locally on your machine.
5.  **Notion Setup**:
    - Paste your **Integration Token**.
    - Paste your **Database ID**. (The 32-character string in your database URL: `notion.so/myworkspace/{DATABASE_ID}?v=...`)
6.  Click **Save Settings**.

---

## 📸 Screenshots

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://github.com/user-attachments/assets/6a40c2d0-a968-476c-b5c8-9e616fc91764" height="400" alt="Home Screen" />
  <img src="https://github.com/user-attachments/assets/135fa8c6-5f6f-4372-b59e-71cbf1bc2273" height="400" alt="Recording" />
  <img src="https://github.com/user-attachments/assets/e36e4f13-e5e0-4cad-995f-805f097a3ba4" height="400" alt="Processing" />
  <img src="https://github.com/user-attachments/assets/82f3a282-3bd6-41d4-b227-fbfb3ecf6799" height="400" alt="Settings" />
</div>

---

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **Desktop Runtime**: [Electron](https://www.electronjs.org/)
-   **Build System**: [Vite](https://vitejs.dev/)
-   **AI Services**: OpenAI SDK, Anthropic SDK, Google Generative AI SDK
-   **Database Integration**: Official Notion Client API

---

## ❓ Troubleshooting

-   **"Microphone permission denied"**: check your OS privacy settings and ensure the app is allowed to access the microphone.
-   **"Notion Error: Could not find database"**: Verify the Database ID and ensure you have **connected** the integration to the specific database page in Notion.
-   **"AI Error"**: Check your API key balance/credits. Most providers require a paid account or active trial.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
