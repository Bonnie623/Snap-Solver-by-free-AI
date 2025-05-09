const axios = require('axios');
const config = require('../config');

class apiService {
    static async getAccessToken() {
        try {
            const response = await axios.post(config.baiduOcr.tokenUrl, null, {
                params: {
                    grant_type: 'client_credentials',
                    client_id: config.baiduOcr.apiKey,
                    client_secret: config.baiduOcr.secretKey
                },
                timeout: 10000
            });

            if (!response.data || !response.data.access_token) {
                throw new Error('获取access_token失败');
            }

            return response.data.access_token;
        } catch (error) {
            console.error('获取百度OCR access_token失败:', error);
            throw new Error('获取access_token失败: ' + (error.response?.data?.error_description || error.message));
        }
    }

    static async extractText(base64Image) {
        try {
            // 移除base64前缀
            let imageData = base64Image;
            if (imageData.startsWith('data:image/')) {
                imageData = imageData.split(',')[1];
            }

            // 获取access_token
            const accessToken = await this.getAccessToken();

            // 调用百度OCR API
            const response = await axios.post(
                `${config.baiduOcr.apiUrl}?access_token=${accessToken}`,
                `image=${encodeURIComponent(imageData)}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 30000
                }
            );

            if (!response.data) {
                throw new Error('OCR服务返回空响应');
            }

            if (response.data.error_code) {
                throw new Error(`OCR处理错误: ${response.data.error_msg || '未知错误'}`);
            }

            if (!response.data.words_result) {
                throw new Error('OCR服务返回数据格式错误');
            }

            // 合并所有识别结果
            const extractedText = response.data.words_result
                .map(result => result.words)
                .join('\n')
                .trim();

            if (!extractedText) {
                throw new Error('提取的文本内容为空');
            }

            return extractedText;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('OCR服务请求超时');
            }
            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    throw new Error('OCR服务认证失败');
                } else {
                    throw new Error(`OCR服务错误(${status}): ${error.response.data?.error_msg || '未知错误'}`);
                }
            } else if (error.request) {
                throw new Error('OCR服务无响应');
            }
            console.error('OCR服务错误详情:', error);
            throw error;
        }
    }

    static async solveProblem(content) {
        try {
            if (!content || typeof content !== 'string') {
                throw new Error('问题内容不能为空');
            }

            const requestBody = {
                model: config.deepSeek.solvingModel,
                messages: [
                    {
                        role: 'user',
                        content: `请解答以下题目。请先用加粗格式（使用 Markdown 语法 **答案**）给出正确答案，然后再详细分析。如果是选择题，请先仔细分析题目中的每一个选项。请始终保持使用题目中的语言种类。\n\n${content}`
                    }
                ],
                max_tokens: config.deepSeek.maxTokens
            };

            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${config.deepSeek.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Host': 'api.deepseek.com'
                    },
                    timeout: 60000
                }
            );

            if (!response.data) {
                throw new Error('AI服务返回空响应');
            }

            if (!response.data.choices || !Array.isArray(response.data.choices)) {
                throw new Error('AI服务返回数据格式错误');
            }

            const result = response.data.choices[0];
            if (!result || !result.message || typeof result.message.content !== 'string') {
                throw new Error('AI响应格式错误');
            }

            const answer = result.message.content.trim();
            if (!answer) {
                throw new Error('AI返回的答案为空');
            }

            return answer;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('AI服务请求超时');
            }
            if (error.response) {
                const status = error.response.status;
                if (status === 429) {
                    throw new Error('AI服务请求次数超限');
                } else if (status === 401) {
                    throw new Error('AI服务认证失败');
                } else {
                    throw new Error(`AI服务错误(${status}): ${error.response.data?.error || '未知错误'}`);
                }
            } else if (error.request) {
                throw new Error('AI服务无响应');
            }
            console.error('AI服务错误详情:', error);
            throw error;
        }
    }

    static async solveWithKimi(base64Image) {
        try {
            if (!base64Image) {
                throw new Error('图片数据不能为空');
            }

            const requestBody = {
                model: config.kimi.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是 Kimi，由 Moonshot AI 提供的人工智能助手。请解答图片中的题目，先给出答案，然后简要分析解题过程。'
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64Image
                                }
                            },
                            {
                                type: 'text',
                                text: '请解答这道题目，先给出答案，然后详细分析解题过程。'
                            }
                        ]
                    }
                ],
                max_tokens: config.kimi.maxTokens
            };

            const response = await axios.post(
                `${config.kimi.baseURL}/chat/completions`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${config.kimi.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 60000
                }
            );

            if (!response.data || !response.data.choices || !Array.isArray(response.data.choices)) {
                throw new Error('Kimi服务返回数据格式错误');
            }

            const result = response.data.choices[0];
            if (!result || !result.message || typeof result.message.content !== 'string') {
                throw new Error('Kimi响应格式错误');
            }

            const answer = result.message.content.trim();
            if (!answer) {
                throw new Error('Kimi返回的答案为空');
            }

            return answer;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Kimi服务请求超时');
            }
            if (error.response) {
                const status = error.response.status;
                if (status === 429) {
                    throw new Error('Kimi服务请求次数超限');
                } else if (status === 401) {
                    throw new Error('Kimi服务认证失败');
                } else {
                    throw new Error(`Kimi服务错误(${status}): ${error.response.data?.error || '未知错误'}`);
                }
            } else if (error.request) {
                throw new Error('Kimi服务无响应');
            }
            console.error('Kimi服务错误详情:', error);
            throw error;
        }
    }
}

module.exports = apiService;