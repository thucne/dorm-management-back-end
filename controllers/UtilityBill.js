const room = require('../models/room.js');
const UtilityBill = require('../models/utilitybill.js');

exports.addUtilitybill = async(req, res) => {
    let utility = new UtilityBill();
    utility.room = req.body.room;
    utility.recorddate = req.body.recorddate;
    utility.power= req.body.power;
    utility.water= req.body.water;
    utility.note = req.body.note;
    utility.paymentstatus = req.body.paymentstatus;
    console.log(utility);
    
    await utility.save(function(err, data) {
        if (err) {
            console.log(err)
            return res.status(404).json({ msg: "Cannot add Utility Bill" });
        } else
            return res.status(201).json({ msg: "Add Utility Bill successfully" });
    })
}
exports.getUtilityById = async(req, res) => {
    let _id = req.params._id;
    UtilityBill.findById(_id).populate("room", "room block dorm_ID")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }

            res.json({
                data: result
            })
        })

}

exports.DeleteUtilityWithDate = async(req, res) => {
    let recorddate = req.body.recorddate;
    UtilityBill.deleteMany({ recorddate: recorddate }, function(err) {
        if (err)
            return res.status(400).json({ msg: "Delete all bill with related date not complete" });
        else
            return res.status(200).json({ msg: "delete all bill with related date completed" });
    });
}

// exports.getUtilityByRoom = async(req, res) => {
//     let room = req.body.room;
//     await UtilityBill.findOne({ room: req.body.room })
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 })
//             }
//             // let differencepower = result.power.recentrecord - result.power.lastrecord;
//             // let differencewater = result.water.recentrecord - result.water.lastrecord;
//             res.json({
//                 data: result,
//                 // differwater: differencewater,
//                 // differpower: differencepower
//             })
//         })
// }
exports.deletebill = async(req, res) => {
    UtilityBill.deleteOne({ _id: req.params._id }, function(err) {
        if (err)
            return res.status(400).json({ msg: "Delete not complete" });
        else
            return res.status(200).json({ msg: "delete completed" });
    });
}

exports.updatePaymentBill = async(req, res) => {
    UtilityBill.updateOne({ _id: req.params._id }, {
        $set: {
            paymentstatus: !paymentstatus,
        }
    }).exec((err, result) => {
        if (err) return res.status(400).json({ msg: err.message });
        res.json({ data: result });
    })

}
exports.showNonPaidBill = async(req, res) => {
    await UtilityBill.find({ paymentstatus: false })
        .populate('room', '_id room block floor')
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}

exports.showNonPaidBillByDate = async(req, res) => {
    recorddate = req.body.recorddate;
    await UtilityBill.find({ recorddate: recorddate, paymentstatus: false })
        .populate('room', 'dorm block room')
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}