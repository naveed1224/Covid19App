const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifiedUserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("UserNotification", notifiedUserSchema)