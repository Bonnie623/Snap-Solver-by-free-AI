require('dotenv').config();

const config = {
    // 允许配置 host，默认监听所有网卡
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    // 可以配置允许访问的 IP 范围
    allowedIPs: process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [],

    imageProcessing: {
        maxFileSize: '100mb'
    },
    // ocr相关配置
    ocrSpace: {
        apiKey: process.env.OCR_SPACE_API_KEY,
        apiUrl: 'https://api.ocr.space/parse/imageurl'
    },
    deepSeek: {
        apiKey: process.env.DEEPSEEK_API_KEY,
        solvingModel: 'deepseek-chat',
        maxTokens: 1000 // 根据需要调整
    }
};

module.exports = config;