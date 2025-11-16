import Anthropic from '@anthropic-ai/sdk';
import { authenticateTokenOptional } from './middleware/auth.js';

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });

const golfRoutes = (app) => {
    app.post('/api/golf/recommend', authenticateTokenOptional, async (req, res) => {
        try {
            const { distance, lie, obstacle } = req.body;

            const prompt = `You are an expert golf caddie. A golfer needs advice for the following shot:

Distance to target: ${distance} yards
Current lie: ${lie}
${obstacle ? `Obstacles/Hazards: ${obstacle}` : ''}

Please provide:
1. Recommended club
2. Shot strategy
3. Brief reasoning

Format your response as JSON with keys: club, strategy, reasoning`;

            const message = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            });

            const responseText = message.content[0].text;
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const recommendation = jsonMatch
                ? JSON.parse(jsonMatch[0])
                : {
                      club: 'Unable to determine',
                      strategy: responseText,
                      reasoning: 'AI response parsing failed'
                  };

            res.json(recommendation);
        } catch (error) {
            console.error('Golf recommendation error:', error);
            res.status(500).json({ error: 'Failed to get recommendation' });
        }
    });
};

export default golfRoutes;
