// 引入必要的库和模块
const axios = require('axios'); // HTTP请求库，用于调用API
const config = require('./config'); // 配置文件，存储API密钥等敏感信息
const fs = require('fs'); // 文件系统模块，用于读取图片文件
const DeepSeekService = require('./services/deepseekService'); // DeepSeek解题服务
const OCRService = require('./services/ocrService'); // OCR识别服务

// 主测试函数
async function testDeepSeekAPI() {
  try {
    // 打印测试开始信息
    console.log('Testing DeepSeek API connection...');
    // 安全显示API密钥前5位（避免泄露完整密钥）
    console.log('API Key:', config.deepseek.apiKey.substring(0, 5) + '...');
    console.log('API URL:', config.deepseek.apiBaseUrl);
    console.log('Model:', config.deepseek.extractionModel);

    // 从命令行参数获取图片路径
    // process.argv[2] 是用户执行命令时传入的图片路径参数
    const imageBuffer = fs.readFileSync(process.argv[2]);
    const fileType = process.argv[2].split('.').pop().toLowerCase();

    // 调用OCR服务识别图片中的文字
    console.log('正在识别图片中的题目文字...');
    const base64Image = `data:image/${fileType};base64,${imageBuffer.toString('base64')}`;
    const problemText = await OCRService.recognize(base64Image, fileType);
    console.log('OCR识别结果：', problemText);

    // 调用DeepSeek解题服务
    console.log('正在发送题目到DeepSeek求解...');
    const answer = await DeepSeekService.solveProblem(
      `请给出以下题目的正确答案：\n${problemText}`,
      false
    );
    
    // 输出最终解题结果
    console.log('解题结果：', answer);
  } catch (error) {
    // 错误处理模块
    console.error('测试过程出错：', error.message);
    console.error('文件路径：', process.argv[2]);
    
    // 如果API返回错误响应
    if (error.response) {
      console.error('响应状态码：', error.response.status);
      // 以易读格式打印错误详情
      console.error('响应数据：', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1); // 非正常退出程序
  }
}

// 立即执行测试函数
(async () => {
  await testDeepSeekAPI();
})();