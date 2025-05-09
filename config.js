require('dotenv').config();
console.log('MOONSHOT_API_KEY:', process.env.MOONSHOT_API_KEY);

const config = {
    // 允许配置 host，默认监听所有网卡
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    // 可以配置允许访问的 IP 范围
    allowedIPs: process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [],

    imageProcessing: {
        maxFileSize: '100mb'
    },
    // 百度OCR相关配置
    baiduOcr: {
        appId: process.env.BAIDU_OCR_APP_ID,
        apiKey: process.env.BAIDU_OCR_API_KEY,
        secretKey: process.env.BAIDU_OCR_SECRET_KEY,
        // 高精度版通用文字识别接口
        apiUrl: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
        // access token获取接口
        tokenUrl: 'https://aip.baidubce.com/oauth/2.0/token'
    },
    deepSeek: {
        apiKey: process.env.DEEPSEEK_API_KEY,
        solvingModel: 'deepseek-chat',
        maxTokens: 1000 // 根据需要调整
    },
    kimi: {
        apiKey: process.env.MOONSHOT_API_KEY,
        baseURL: 'https://api.moonshot.cn/v1',
        model: 'moonshot-v1-8k-vision-preview',
        maxTokens: 1000
    }
};

module.exports = config;