const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    // email: { // not storing email for privacy
    //     type: String,
    //     required: true
    // },
    uuid: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Cases", caseSchema)