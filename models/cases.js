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
    neighborhood: {
        type: String
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String
    },
    uuid: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Cases", caseSchema)