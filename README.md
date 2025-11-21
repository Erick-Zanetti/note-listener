# Note Listener 🎙️🧠

**Turn your mental chaos into structured Notion notes with the power of AI.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-v28+-informational)
![React](https://img.shields.io/badge/React-v18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5+-blue)

Note Listener is a modern desktop application built with **Electron** and **React** that helps you capture thoughts, ideas, and tasks using your voice. It uses advanced AI models (OpenAI, Anthropic, or Gemini) to transcribe, summarize, categorize, and tag your audio notes before automatically saving them to your **Notion** database.

---

## ✨ Features

- **🎙️ Flexible Recording**: 
  - **Web Speech API**: Free, real-time transcription (requires internet).
  - **OpenAI Whisper**: High-fidelity transcription for complex audio (requires API key).
- **🧠 AI-Powered Processing**:
  - Supports **OpenAI (GPT-4o/Mini)**, **Anthropic (Claude 3.5)**, and **Google (Gemini 1.5)**.
  - Automatically extracts a **Title**, **Category**, **Tags**, and a structured **Summary**.
- **🌍 Multi-Language Support**:
  - Configure the AI to output summaries in English, Portuguese, Spanish, French, German, and more.
  - Auto-detects input language when using Whisper.
- **📝 Seamless Notion Integration**:
  - Sends processed notes directly to a specified Notion Database.
  - Maps fields automatically: `Name`, `Category`, `Tags`, `Date`, `Hour`, `Transcript`, and `Content`.
- **🎨 Premium UI/UX**:
  - Glassmorphic design with ambient lighting effects.
  - Dark mode optimized.
  - Responsive and intuitive interface.

---

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or higher) installed.
2.  **Notion Integration**:
    - Create an internal integration at [Notion Developers](https://www.notion.so/my-integrations).
    - Get your **Internal Integration Token**.
    - Create a Database in Notion with the following properties:
        - `Name` (Title)
        - `Category` (Select)
        - `Tags` (Multi-select)
        - `Date` (Date)
        - `Hour` (Rich Text or Text)
        - `Transcript` (Rich Text or Text)
        - `Content` (Rich Text or Text - *for the AI summary*)
    - **Important**: Share your database with your integration (Click `...` on the database page > `Connect to` > Select your integration).
3.  **AI API Keys**:
    - At least one API key from: [OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/note-listener.git
    cd note-listener
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run electron:dev
    ```

---

## ⚙️ Configuration

Once the app is running:

1.  Click the **Settings** (gear icon) in the top right corner.
2.  **AI Configuration**:
    - Select your preferred **Default Provider**.
    - Choose your **AI Output Language** (e.g., English, Portuguese).
    - (Optional) Customize the **System Prompt** to change how the AI summarizes your notes.
3.  **Transcription**:
    - Choose between **Browser** (Free) or **Whisper** (Paid/Higher Quality).
4.  **API Keys**:
    - Enter the API keys for the providers you intend to use.
5.  **Notion Integration**:
    - Paste your **Integration Token**.
    - Paste your **Database ID** (found in the Notion URL of your database).
6.  Click **Save Settings**.

---

## 🛠️ Tech Stack

-   **Core**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **AI Integration**: OpenAI SDK, Anthropic SDK, Google Generative AI SDK
-   **Data**: Notion Client API

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
