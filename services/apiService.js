const axios = require('axios');
const config = require('../config');

class apiService {
    static async extractText(base64Image) {
        try {
            const response = await axios.post('https://api.ocr.space/parse/image', {
                base64Image: `data:image/png;base64,${base64Image}`,
                language: 'chs',
                isOverlayRequired: false
            }, {
                headers: {
                    'apikey': config.ocrSpace.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.ParsedResults || !response.data.ParsedResults[0]) {
                throw new Error('Invalid response from OCR API');
            }

            return response.data.ParsedResults[0].ParsedText.trim();
        } catch (error) {
            console.error('Text Extraction Error:', error.response?.data || error.message);
            throw new Error('Failed to extract text from image');
        }
    }

    static async solveProblem(content) {
        try {
            const requestBody = {
                model: config.deepSeek.solvingModel,
                messages: [
                    {
                        role: 'user',
                        content: `请解答以下题目。如果是选择题，请先仔细分析题目中的每一个选项，然后给我正确答案。请始终保持使用题目中的语言种类。\n\n${content}`
                    }
                ],
                max_tokens: config.deepSeek.maxTokens
            };

            const response = await axios.post(
                'https://api.deepseek.com/v1/chat',
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${config.deepSeek.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('Invalid response from DeepSeek API');
            }

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Problem Solving Error:', error.response?.data || error.message);
            throw new Error('Failed to solve the problem');
        }
    }
}

module.exports = apiService;