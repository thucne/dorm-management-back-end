const UtilityBill = require('../models/utilitybill')

exports.addUtilitybill = async(req, res) => {
    let utility = new UtilityBill();
    utility.room = req.body.room;
    utility.recorddate = req.body.recorddate;
    utility.power.lastrecord = req.body.pwlastrecord;
    utility.power.recentrecord = req.body.pwrecentrecord;
    utility.water.lastrecord = req.body.wtlastrecord;
    utility.water.recentrecord = req.body.wtrecentrecord;
    await utility.save(function(err, data) {
        if (err) {
            console.log(err)
            return res.status(404).json({ msg: "Cannot add Utility Bill" });
        } else
            return res.status(201).json({ msg: "Add Utility Bill successfully" });
    })
}
exports.getUtilityByRoom = async(req, res) => {
    let room = req.params.room;
    UtilityBill.findOne({ room })
        .exec((err, utility) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json(utility)
        })
}