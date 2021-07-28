import { Document, model, Schema } from 'mongoose';

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email: string) => regEmail.test(email);

export interface IOrder extends Document {
    sender: string;
    recipients: Array<string>;
    fileInfos: any;
    action: any;
    password: string;
    message: string;
    createdDate: Date;
    expiredDate: Date;
}

// Setup schema
const schema = new Schema<IOrder>({
    sender: {
        type: String,
        required: true,
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
    }
});

export const Order = model<IOrder>('Order', schema);