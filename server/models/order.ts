import { Document, model, Schema } from 'mongoose';

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email: string) => {
    if (email){
        console.log('validateEmail', email);
        return regEmail.test(email);
    }
    else
        return true;
}

export enum SendActions {
    SendEmail = 1,
    CopyLink = 2
}

export interface IOrder extends Document {
    sender: string;
    recipients: Array<string>;
    fileInfos: any;
    action: SendActions;
    password: string;
    message: string;
    createdDate: Date;
    expiredDate: Date;
    link: string;
    totalDownloads: number;
    isAnonymous: boolean;
}

// Setup schema
const schema = new Schema<IOrder>({
    sender: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    recipients: {
        type: Array,
        required: false
    },
    fileInfos: {
        type: Schema.Types.Mixed,
        required: true
    },
    action: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    createdDate: {
        type: Date,
        default: new Date()
    },
    expiredDate: {
        type: Date,
        default: new Date()
    },
    link: {
        type: String
    },
    totalDownloads: {
        type: Number,
        default: 0
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
});

export const Order = model<IOrder>('Order', schema);