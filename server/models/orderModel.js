var mongoose = require('mongoose');

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = (email) => {
    return regEmail.test(email)
};

// Setup schema
var orderSchema = mongoose.Schema({
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
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    option: {
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
// Export Order model
var Order = module.exports = mongoose.model('order', orderSchema);
module.exports.get = function (callback, limit) {
    Order.find(callback).limit(limit);
}