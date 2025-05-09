const ImageService = require('../services/imageService');
const apiService = require('../services/apiService');

class ImageController {
    constructor(io) {
        this.io = io;
    }

    handleImageUpload = async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        try {
            const base64Image = req.file.buffer.toString('base64');
            this.io.emit('new_image_uploaded', { image: base64Image });
            res.send('Initial image uploaded. Waiting for crop settings.');
        } catch (error) {
            console.error('Upload Error:', error);
            res.status(500).send('An error occurred while uploading the image.');
        }
    }

    processCropAndExtract = async (req, res) => {
        const { cropSettings, image } = req.body;

        try {
            const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const base64CroppedImage = await ImageService.processImage(buffer, cropSettings);
            let processedImage = base64CroppedImage;
            if (!processedImage.startsWith('data:image/')) {
                processedImage = `data:image/png;base64,${processedImage}`;
            }
            const extractedText = await apiService.extractText(processedImage);

            res.json({ extractedText });
        } catch (error) {
            console.error('Processing Error:', error);
            res.status(500).send('An error occurred while processing the image.');
        }
    }

    solveWithImage = async (req, res) => {
        const { cropSettings, image } = req.body;

        try {
            const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const base64CroppedImage = await ImageService.processImage(buffer, cropSettings);
            const processedImage = `data:image/png;base64,${base64CroppedImage}`;
            const extractedText = await apiService.extractText(processedImage);
            const answer = await apiService.solveProblem(extractedText);

            res.json({ answer });
        } catch (error) {
            console.error('Solving Error:', error);
            res.status(500).send('An error occurred while solving with image.');
        }
    }

    solveWithKimi = async (req, res) => {
        const { cropSettings, image } = req.body;

        try {
            const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const base64CroppedImage = await ImageService.processImage(buffer, cropSettings);
            const processedImage = `data:image/png;base64,${base64CroppedImage}`;
            const answer = await apiService.solveWithKimi(processedImage);

            res.json({ answer });
        } catch (error) {
            if (error.message === '未配置Kimi API密钥') {
                res.status(400).send('请先配置Kimi API密钥');
            } else {
                console.error('Kimi Solving Error:', error);
                res.status(500).send('使用Kimi解题时发生错误');
            }
        }
    }
}

module.exports = ImageController;