const apiService = require('../services/apiService');

class ProblemController {
    solveProblem = async (req, res) => {
        const { extractedText } = req.body;

        try {
            const answer = await apiService.solveProblem(extractedText);
            res.json({ answer });
        } catch (error) {
            console.error('Solving Error:', error);
            res.status(500).send('An error occurred while solving the problem.');
        }
    }
}

module.exports = ProblemController;