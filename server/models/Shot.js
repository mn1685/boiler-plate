import mongoose from 'mongoose';

const shotSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        },
        distanceToTarget: {
            type: Number, // in yards
            required: true
        },
        lie: {
            type: String,
            enum: ['fairway', 'rough', 'sand', 'tee', 'green'],
            required: true
        },
        clubUsed: {
            type: String,
            required: true
        },
        outcome: {
            distanceAchieved: Number,
            accuracy: String, // 'left', 'right', 'center'
            strokesGained: Number
        },
        weather: {
            windSpeed: Number, // mph
            windDirection: Number, // degrees
            temperature: Number // fahrenheit
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

shotSchema.index({ location: '2dsphere' });
shotSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('Shot', shotSchema);
