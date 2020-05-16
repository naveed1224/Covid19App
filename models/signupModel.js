const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSignupSchema = Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    neibhorhood: {
        type: String
    },
    city: {
        type: String
    },
    timesNotified: {
        type: Number
    },
    status: {
        type: String,
        required: true
    },
    confirmCode: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('userSignupNotification', userSignupSchema);