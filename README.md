[English README](README_EN.md)

# 📚 Snap-Solver-基础版—免费ai

> 一键识题，自动解答 —— 你的智能解题助手

Snap-Solver 是一个智能题目解答工具，只需**按下快捷键**，即可**在另一台设备上**自动识别题目并给出详细解答。

## ✨ 特色功能

- 🎯 **一键截图**：使用快捷键（可自定义）即可远程监控电脑屏幕
- 🌐 **局域网共享**：一处部署，多处使用，同一网络下**所有设备**都是监控设备
- 🤖 **AI 解答**：推荐使用Kimi直接图片解题，也可选择OCR+Deepseek组合方案
- 💻 **跨平台支持**：Windows、MacOS、Linux、ios、Android全平台可用
> 需要命令行启动。

## 📋 使用前准备

1. **解题方案选择**（二选一）:
   - **方案一：Kimi直接图片解题**
     - 只需配置Kimi API Key
     - 支持直接图片解题，无需OCR
     - 配置简单，有免费额度
     - 访问 [Kimi官网](https://kimi.moonshot.cn/) 注册并获取API Key

   - **方案二：OCR+Deepseek组合**
     - 如果只配置ocr,就是ocr+kimi：
       1. 百度OCR API（用于识别文字，每天1000次免费额度）
          - 访问[百度智能云控制台](https://console.bce.baidu.com/ai-engine/ocr/overview/index)注册
          - 创建文字识别应用获取API Key
       2. Deepseek API（付费服务）
          - 用于解答题目
          - 需要配合OCR使用，因为不支持直接图片解题

3. **配置 API 密钥**：
   - 修改项目根目录中的 `.env.example` 文件重命名为 `.env`
   - 在 `.env` 文件中填入必需的API密钥：
     - Kimi API密钥（MOONSHOT_API_KEY）
   - 如果选择使用Deepseek服务，还需填入（记得删除前面的#）：
     - Deepseek API密钥（DEEPSEEK_API_KEY）
     - 百度OCR相关密钥（APP_ID、API_KEY、SECRET_KEY）

4. **准备环境**：
   - [Node.js](https://nodejs.org/) 14.0 或更高版本
   - [Python](https://www.python.org/downloads/) 3.x 版本

   - 确保系统中安装了 Node.js 和 Python3，并加入环境变量路径。
   - 打开命令行（终端）：
     - Windows用户：按下`Win + R`键，输入`cmd`并回车
     - Mac用户：按下`Command + 空格`键，输入`terminal`并回车
   - 进入项目目录：
     - Windows用户：
       1. 复制项目所在文件夹的完整路径（在文件夹地址栏点击，`Ctrl + C`复制）
       2. 先输入项目所在盘符并回车（例如：`f:`）
       3. 输入`cd `后右键粘贴复制的路径，回车确认
     - Mac用户：
       1. 输入`cd `（注意空格）
       2. 将项目文件夹拖入终端窗口（自动填入路径）
       3. 回车确认
   - 执行以下命令安装依赖：
     ```
     npm install
     pip install keyboard Pillow requests
     ```

5. **启动项目**：在终端（或命令提示符）中执行以下命令启动服务：
   npm start
   **终止指令**
   Ctrl+C

## 💡 使用说明

> 💡 首次使用请先完成【使用前准备】的所有步骤

## ❓ 常见问题

1. **问**：如何确认Node.js和Python安装成功？
   **答**：在命令行中分别输入`node -v`和`python --version`，如果显示版本号就说明安装成功。

2. **问**：安装依赖时报错怎么办？
   **答**：
   - 确保电脑已连接网络
   - 如果提示"npm not found"，说明Node.js没有安装成功
   - 如果提示"pip not found"，说明Python没有安装成功
   - 如果遇到权限相关错误，可以尝试使用管理员权限运行cmd（仅在安装依赖时需要，运行项目时使用普通用户权限即可）

3. **问**：启动服务后打不开网页怎么办？
   **答**：
   - 确保命令行显示服务启动成功
   - 检查浏览器地址是否输入正确
   - 如果用其他设备访问，确保和服务器在同一个网络下

## 💡 使用说明

### 1. 访问服务

- **本机访问**：打开浏览器，访问 http://localhost:3000
- **局域网访问**：其他设备使用 http://[服务器IP]:3000
  > 💡 服务器 IP 会在启动时显示在控制台中

### 2. 截图解题

1. 按下 `Alt + Ctrl + S` 组合键
2. 拖动鼠标选择题目区域
3. 松开鼠标完成截图
4. 选择使用Kimi直接图片解题，或者使用百度OCR文字识别（可以自行调整文字）+Deepseek组合方案

## 📜 开源许可

本项目采用 [MIT](LICENSE) 许可证。
