import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken, authenticateTokenOptional } from './middleware/auth.js';
import GolfProfile from './models/GolfProfile.js';

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_KEY });

const golfRoutes = (app) => {
    app.get('/api/golf/profile', authenticateToken, async (req, res) => {
        try {
            const profile = await GolfProfile.findOne({ userId: req.user.id });
            if (!profile) {
                return res.json({ clubs: [], handicap: null, preferredHand: 'right' });
            }
            res.json(profile);
        } catch (error) {
            console.error('Error fetching golf profile:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    });

    app.post('/api/golf/profile', authenticateToken, async (req, res) => {
        try {
            const { clubs, handicap, preferredHand } = req.body;

            const profile = await GolfProfile.findOneAndUpdate(
                { userId: req.user.id },
                {
                    userId: req.user.id,
                    clubs,
                    handicap,
                    preferredHand
                },
                { upsert: true, new: true }
            );

            res.json(profile);
        } catch (error) {
            console.error('Error saving golf profile:', error);
            res.status(500).json({ error: 'Failed to save profile' });
        }
    });

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
