import { Document, model, Schema } from 'mongoose';

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email: string) => {
    if (email) {
        return regEmail.test(email);
    }
    else
        return true;
}

export interface IDrive extends Document {
    ownerId: string;
    ownerEmail: string;
    fileInfos: any;
    createdDate: Date;
    link: string;
}

// Setup schema
const schema = new Schema<IDrive>({
    ownerEmail: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    ownerId: {
        type: String,
        required: true
    },
    fileInfos: {
        type: Schema.Types.Mixed,
        required: true
    },
    link: {
        type: String
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
});

export const Drive = model<IDrive>('Drive', schema);