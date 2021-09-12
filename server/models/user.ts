import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    codeResetPassword: string;
    created: Date;
    codeActivation: string;
    isActive: boolean;
    totalSize: number;
    codeExpiresIn: Date;
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
    codeResetPassword: {
        type: String,
        required: false
    },
    codeActivation: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false
    },
    codeExpiresIn: {
        type: Date,
        required: false
    },
    totalSize:{
        type: Number,
        default: 0
    }

});

export const User = model<IUser>('User', schema);