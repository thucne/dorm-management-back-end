const mongoose = require("mongoose");
const adminSchema = mongoose.Schema({
    name: { type: String, require: true },
    gender: { type: String, require: true },
    email: { type: Number, require: true },
    password: { type: String, require: true },
    tel: { type: String, require: true }

});

const Admin = mongoose.model("Admin", adminSchema, 'Admin');