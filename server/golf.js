import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken, authenticateTokenOptional } from './middleware/auth.js';
import GolfProfile from './models/GolfProfile.js';
import Shot from './models/Shot.js';

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

            // Fetch user's golf profile if authenticated
            let userProfile = null;
            if (req.user) {
                userProfile = await GolfProfile.findOne({ userId: req.user.id });
            }

            // Build prompt with user's club data if available
            let clubInfo = '';
            if (userProfile && userProfile.clubs && userProfile.clubs.length > 0) {
                const clubList = userProfile.clubs
                    .map((c) => `${c.club}: ${c.avgDistance} yards`)
                    .join('\n');
                clubInfo = `\n\nGolfer's club bag and average distances:\n${clubList}`;
            }

            const handicapInfo =
                userProfile && userProfile.handicap
                    ? `\nHandicap: ${userProfile.handicap}`
                    : '';

            const prompt = `You are an expert golf caddie. A golfer needs advice for the following shot:

Distance to target: ${distance} yards
Current lie: ${lie}
${obstacle ? `Obstacles/Hazards: ${obstacle}` : ''}${handicapInfo}${clubInfo}

Please provide:
1. Recommended club${clubInfo ? ' (choose from their bag if possible)' : ''}
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

    app.post('/api/golf/shots', authenticateToken, async (req, res) => {
        try {
            const { distance, lie, obstacle, aiRecommendation, clubUsed, outcome } = req.body;

            const shot = new Shot({
                userId: req.user.id,
                distance,
                lie,
                obstacle,
                aiRecommendation,
                clubUsed,
                outcome
            });

            await shot.save();
            res.status(201).json(shot);
        } catch (error) {
            console.error('Error saving shot:', error);
            res.status(500).json({ error: 'Failed to save shot' });
        }
    });

    app.get('/api/golf/shots', authenticateToken, async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const shots = await Shot.find({ userId: req.user.id })
                .sort({ createdAt: -1 })
                .limit(limit);

            res.json(shots);
        } catch (error) {
            console.error('Error fetching shots:', error);
            res.status(500).json({ error: 'Failed to fetch shots' });
        }
    });

    app.delete('/api/golf/shots/:id', authenticateToken, async (req, res) => {
        try {
            const shot = await Shot.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });

            if (!shot) {
                return res.status(404).json({ error: 'Shot not found' });
            }

            res.json({ message: 'Shot deleted' });
        } catch (error) {
            console.error('Error deleting shot:', error);
            res.status(500).json({ error: 'Failed to delete shot' });
        }
    });

    app.get('/api/golf/analytics', authenticateToken, async (req, res) => {
        try {
            const shots = await Shot.find({ userId: req.user.id });

            // Basic stats
            const totalShots = shots.length;

            // Shots by lie type
            const shotsByLie = shots.reduce((acc, shot) => {
                acc[shot.lie] = (acc[shot.lie] || 0) + 1;
                return acc;
            }, {});

            // Average distance by lie
            const distanceByLie = shots.reduce((acc, shot) => {
                if (!acc[shot.lie]) {
                    acc[shot.lie] = { total: 0, count: 0 };
                }
                acc[shot.lie].total += shot.distance;
                acc[shot.lie].count += 1;
                return acc;
            }, {});

            const avgDistanceByLie = Object.keys(distanceByLie).reduce((acc, lie) => {
                acc[lie] = Math.round(distanceByLie[lie].total / distanceByLie[lie].count);
                return acc;
            }, {});

            // Most recommended clubs
            const clubRecommendations = shots
                .filter((s) => s.aiRecommendation?.club)
                .reduce((acc, shot) => {
                    const club = shot.aiRecommendation.club;
                    acc[club] = (acc[club] || 0) + 1;
                    return acc;
                }, {});

            // Most used clubs
            const clubsUsed = shots
                .filter((s) => s.clubUsed)
                .reduce((acc, shot) => {
                    acc[shot.clubUsed] = (acc[shot.clubUsed] || 0) + 1;
                    return acc;
                }, {});

            // Recent activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentShots = shots.filter((s) => new Date(s.createdAt) >= sevenDaysAgo);

            res.json({
                totalShots,
                shotsByLie,
                avgDistanceByLie,
                clubRecommendations,
                clubsUsed,
                recentShots: recentShots.length,
                hasData: totalShots > 0
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    });
};

export default golfRoutes;
