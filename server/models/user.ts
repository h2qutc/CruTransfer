import { model, Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    created: Date;
}


// Setup schema
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
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

export const User = model<IUser>('User', schema);

// Export User model
// var User = module.exports = mongoose.model('user', userSchema);
// module.exports.get = function (callback, limit) {
//     User.find(callback).limit(limit);
// }