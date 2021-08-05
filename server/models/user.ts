import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    code: string;
    created: Date;
}

const schema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: [8],
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    code: {
        type: String,
        required: false
    }
});

export const User = model<IUser>('User', schema);