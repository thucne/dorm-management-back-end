const mongoose = require('mongoose');
const notification =mongoose.Schema({
    title: { type: String, require: true },
    to: {type:String,required:true},
    content: { type: String, require: true },
    createAt: { type: Date, default:Date.now()  }
});

module.exports = Notification = mongoose.model('notification', notification);