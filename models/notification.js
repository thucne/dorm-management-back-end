const mongoose = require('mongoose');
const notification =mongoose.Schema({
    title: { type: String, require: true },
    photo: { type: String, default:'' },
    content: { type: String, require: true },
    createAt: { type: Date, default:Date.now()  }
});

module.exports = Notification = mongoose.model('notification', notification);