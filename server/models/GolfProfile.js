import mongoose from 'mongoose';

const clubDistanceSchema = new mongoose.Schema({
    club: {
        type: String,
        required: true
    },
    avgDistance: {
        type: Number, // in yards
        required: true
    }
});

const golfProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        handicap: {
            type: Number,
            min: -5,
            max: 54
        },
        clubs: [clubDistanceSchema],
        preferredHand: {
            type: String,
            enum: ['right', 'left'],
            default: 'right'
        }
    },
    { timestamps: true }
);

export default mongoose.model('GolfProfile', golfProfileSchema);
