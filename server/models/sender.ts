import { Document, model, Schema } from 'mongoose';

export interface ISender extends Document {
    email: string;
    code: string;
    created: Date;
    codeExpiresIn: Date;
}

const schema = new Schema<ISender>({

    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    codeExpiresIn: {
        type: Date,
        required: false
    }

});

export const Sender = model<ISender>('Sender', schema);