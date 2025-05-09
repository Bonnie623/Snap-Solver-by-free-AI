[中文 README](README.md)

# 📚 Snap-Solver-Basic

> Quick solutions at your fingertips — your smart question-solving assistant

Snap-Solver is a smart tool that solves questions for you. Simply **press a hotkey**, and it will automatically recognize the question and provide detailed answers **on another device**.

## ✨ Key Features

- 🎯 **One-click Screenshot**: Use hotkey (customizable) to remotely monitor computer screen
- 🌐 **LAN Sharing**: Deploy once, use anywhere - all devices in the same network are monitoring devices
- 🤖 **AI Solutions**: Recommended to use Kimi for direct image-based problem solving, or optional OCR+Deepseek combination solution
- 💻 **Cross-platform Support**: Available on Windows, MacOS, Linux, iOS, Android
> Requires command line startup.

## 📋 Prerequisites

1. **Required API** (only one needed for basic functionality):
   - **Kimi API Key** (for AI problem solving):
     - Visit [Kimi Official Website](https://kimi.moonshot.cn/) to register
     - Get API Key in personal settings
     - Kimi supports direct image-based problem solving, which is the simplest and quickest method

2. **Optional APIs** (if you need OCR+Deepseek solution):
   - **Baidu OCR API Key** (for text recognition):
     - Visit [Baidu AI Cloud Console](https://console.bce.baidu.com/ai-engine/ocr/overview/index) to register
     - Create text recognition application to get free API Key (1000 free recognitions per day)
   - **Deepseek API Key** (paid service):
     - If you want to use Deepseek's problem-solving service
     - Note: Must be used with Baidu OCR as Deepseek doesn't support direct image-based problem solving

3. **Configure API Keys**:
   - Rename `.env.example` file in project root to `.env`
   - Fill in required API keys in `.env` file:
     - Baidu OCR related keys (APP_ID, API_KEY, SECRET_KEY)
     - Kimi API key (MOONSHOT_API_KEY)
   - If choosing to use Deepseek service, also fill in:
     - Deepseek API key (DEEPSEEK_API_KEY)

4. **Environment Setup**:
   - [Node.js](https://nodejs.org/) version 14.0 or higher
   - [Python](https://www.python.org/downloads/) version 3.x

   - Ensure Node.js and Python3 are installed and added to environment path.
   - Open command line (terminal):
     - Windows users: Press `Win + R`, type `cmd` and press Enter
     - Mac users: Press `Command + Space`, type `terminal` and press Enter
   - Navigate to project directory:
     - Windows users:
       1. Copy full path of project folder (click in folder address bar, `Ctrl + C` to copy)
       2. In command line, type: `cd your_copied_path` (right-click to paste) and press Enter
     - Mac users:
       1. Type `cd ` (note the space)
       2. Drag project folder into terminal window (auto-fills path)
       3. Press Enter to confirm
   - Run following commands to install dependencies:
     ```
     npm install
     pip install keyboard Pillow requests
     ```

5. **Start Project**: Run following command in terminal to start service:
   ```
   npm start
   ```

## 💡 Usage Instructions

> 💡 Please complete all steps in [Prerequisites] before first use

### 1. Accessing the Service

- **Local Access**: Open your browser and go to http://localhost:3000
- **LAN Access**: Use http://[Server IP]:3000 on other devices in the same network  
  > 💡 The server IP will be shown in the console at startup.

### 2. Screenshot Problem Solving

1. Press `Alt + Ctrl + S`  
2. Drag to select the question area  
3. Release mouse to complete screenshot  
4. Choose to use Kimi for direct image-based problem solving, or use Baidu OCR text recognition (text can be adjusted manually) + Deepseek combination solution

## ❓ Common Issues

1. **Q**: How to confirm Node.js and Python installation success?
   **A**: Type `node -v` and `python --version` in command line respectively. Version number display indicates successful installation.

2. **Q**: What if error occurs when installing dependencies?
   **A**:
   - Ensure computer is connected to network
   - Try running command line with administrator privileges
   - If "npm not found", Node.js installation unsuccessful
   - If "pip not found", Python installation unsuccessful

3. **Q**: What if webpage won't open after starting service?
   **A**:
   - Ensure command line shows service started successfully
   - Check if browser address is correct
   - If accessing from other device, ensure it's on same network as server

## 📜 License

This project is licensed under the [MIT](LICENSE) License.

---

💝 If you found this project helpful, please give it a Star! Thank you!