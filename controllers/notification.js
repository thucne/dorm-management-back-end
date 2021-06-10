const Notification = require('../models/notification')
exports.studentGetAnnouncementAndEmail = async (req, res) => {
    await Notification.find({$or:[ {'to':"all"}, {'to':{ "$regex":req.body.email, "$options": "i" }}]})
        .sort({ "createAt": -1 })
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}
exports.adminGetAnnouncementAndEmail = async (req, res) => {
    await Notification.find({})
        .sort({ "createAt": -1 })
        .exec((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                })
            }
            res.json({ data: result })
        })
}
exports.createNotification = async (req, res) => {
	const { title,to,content } = req.body;
	if (!title || !content)
		return res.status(422).json({ error: "Please enter all the  fields" });
	let noti = {};
	noti.title = title;
	noti.to =to;
	noti.content = content;
    noti.createAt=Date.now();
		//.catch(err=>console.log(err));
	let notifi = new Notification(noti);
	await notifi.save(function (err, data) {
		if (err)
			return res.status(422).json({ error: "Error occurs while processing, please try again." });
		else
			return res.status(201).json({ msg: "Create notification success" });
	});
}
exports.seeDetailNotification = async (req, res) => {
    Notification.find({_id:req.params._id})
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({data:result})
    })
}
exports.deleteNotification = async (req, res) => {
    Notification.deleteOne({ _id: req.params._id }, function (err) {
        if (err) return res.status(402).json({ msg: "Delete not complete" });
        else return status(200).json({ msg: "delete completed" });
        // deleted at most one tank document
    });
}


exports.updateNotification=async (req,res)=>{
	Notification.findById(req.params._id).exec((err, oldNoti) => {
		if (err) {
			return res.status(400).json({
				error: err
			})
		}
		let form = new formidable.IncomingForm();
		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			if (err) {
				return res.status(400).json({ error: err })
			}
			//let bookSlugBeforeMerge = oldBook.slug
			//  oldUser = _.merge(oldUser, fields)
			//oldUser = _.merge(oldUser, fields)

			var {title,content} = fields
            if (title == null || String(title).trim().length == 0)
				return res.status(400).json({ error: "You should field title" })
			else if (content == null || String(content).trim() ==0)
				return res.status(400).json({ error: "You should field content" })
            oldNoti.title=String(title).trim();
            oldNoti.content=String(cotent).trim();
            oldNoti.createAt=Date.now();
			oldNoti.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err
					})
				}
				res.json({ msg: 'Update notification sucessfully', data: result })
			})

		})
	})
}