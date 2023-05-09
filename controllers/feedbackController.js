const Feedback = require('../models/feedback');

exports.upvote = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.session.user.id;
        const feedback = await Feedback.findOne({ where: { jobId: id, postedBy: userID } });
        if (!feedback) {
            await Feedback.create({
                upvote: true,
                downvote: false,
                jobId: id,
                postedBy: userID
            });
            res.json({ upvote: true, downvote: false, increaseCount: true });
        }
        else {
            if (feedback.upvote === true) {
                feedback.upvote = false;
                await feedback.save();
                res.json({ upvote: false, downvote: feedback.downvote, increaseCount: false });
            }
            else {
                feedback.upvote = true;
                feedback.downvote = false;
                await feedback.save();
                res.json({ upvote: true, downvote: false, increaseCount: true });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.downvote = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.session.user.id;
        const feedback = await Feedback.findOne({ where: { jobId: id, postedBy: userID } });
        if (!feedback) {
            await Feedback.create({
                upvote: false,
                downvote: true,
                jobId: id,
                postedBy: userID
            });
            res.json({ upvote: false, downvote: true, increaseCount: true });
        }
        else {
            if (feedback.downvote === true) {
                feedback.downvote = false;
                await feedback.save();
                res.json({ upvote: feedback.upvote, downvote: false, increaseCount: false });
            }
            else {
                feedback.upvote = false;
                feedback.downvote = true;
                await feedback.save();
                res.json({ upvote: false, downvote: true, increaseCount: true });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
}

exports.create = async (req, res) => {
    try {
        const id = req.body.jobID;
        const userID = req.session.user.id;
        const content = req.body.comment;
        const feedback = await Feedback.findOne({ where: { jobId: id, postedBy: userID } });
        if (!feedback) {
            await Feedback.create({
                upvote: false,
                downvote: false,
                content: content,
                jobId: id,
                postedBy: userID
            });
            res.redirect('/job/view/' + id);
        }
        else {
            feedback.content = content;
            await feedback.save();
            res.redirect('/job/view/' + id);
        }
    } catch (err) {
        console.log(err);
        res.render('/job/view/' + id, {
            err: err,
            req: req,
            comment: content
        })
    }
}