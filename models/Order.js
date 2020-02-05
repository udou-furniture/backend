const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    purchased: {
        type: Boolean,
        default: false
    },
    saved: {
        type: Boolean,
        default: false
    },
    review: {
        type: String,
        default: ''
    },
    customerEmail: String,
    configuration: {
        height: Number, 
        width: Number,
        depth: Number,
        colour: String,
        price: Number,
        furnitureType: String
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order