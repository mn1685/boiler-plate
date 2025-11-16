import mongoose from 'mongoose';

const shotSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        distance: {
            type: Number, // in yards
            required: true
        },
        lie: {
            type: String,
            enum: ['fairway', 'rough', 'sand', 'tee', 'green', 'bunker'],
            required: true
        },
        obstacle: {
            type: String, // water, trees, bunker, etc.
        },
        aiRecommendation: {
            club: String,
            strategy: String,
            reasoning: String
        },
        clubUsed: String,
        outcome: String
    },
    { timestamps: true }
);

shotSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Shot', shotSchema);
