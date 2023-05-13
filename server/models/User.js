const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    age: String,
    sex: String,
    mobile: Number,
    govtIdType: String,
    govtId: String,
    label: String,
    guardian: String,
    email: String,
    emergencyNumber: Number,
    address: String,
    state: String,
    city: String,
    country: String,
    pincode: Number,
    occupation: String,
    religion: String,
    maritalStatus: String,
    bloodGroup: String,
    nationality: String,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;