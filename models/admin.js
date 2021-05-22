const mongoose = require('mongoose');
const admin =mongoose.Schema({
    name: { type: String, require: true },
    gender: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    tel: { type: String, require: true }

});

module.exports = Admin = mongoose.model('admin', admin);