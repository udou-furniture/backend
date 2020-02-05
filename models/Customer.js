const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    email: {
        type: String,
        unique: true
    }, 
    password: String,
    firstname: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    postcode: Number,
    phoneNumber: Number
}, {
    timestamps: true
})

CustomerSchema.plugin(uniqueValidator);
const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer