import { model, Schema, Document } from 'mongoose';

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email: string) => regEmail.test(email);

interface IOrder extends Document {
    sender: string;
    recipients: Array<string>;
    fileInfos: any;
    action: any;
    password: string;
    message: string;
    created: Date
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
    created: {
        type: Date,
        default: Date.now
    }
});

export const Order = model<IOrder>('Order', schema);

// Export Order model
// var Order = module.exports = mongoose.model('order', orderSchema);
// module.exports.get = function (callback, limit) {
//     Order.find(callback).limit(limit);
// }