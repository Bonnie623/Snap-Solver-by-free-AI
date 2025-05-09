const OCRService = require('./services/ocrService');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const imagePath = process.argv[2];
    if (!imagePath) {
      throw new Error('请提供图片路径作为参数');
    }

    if (!fs.existsSync(imagePath)) {
      throw new Error(`图片文件不存在: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const fileType = path.extname(imagePath).replace('.', '');
    const base64Image = `data:image/${fileType};base64,${imageBuffer.toString('base64')}`;

    const ocrText = await OCRService.recognize(base64Image, fileType);
    const answer = await DeepSeekService.solveProblem(ocrText, config.deepseek.models.solving);
    console.log('OCR识别原始文本:\n', ocrText);
  } catch (error) {
    console.error('处理失败:', error.message);
  }
}

main();