const Job = require('../models/job');
const User = require('../models/user');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Feedback = require('../models/feedback');

exports.create = async (req, res) => {
    try {
        const { title, description, location, requirements, company } = req.body;
        const postedBy = req.session.user.id;
        //validate
        if (!title || !description || !location || !company) {
            return res.render('create', {
                err: "Please fill in all required fields",
                title: title,
                description: description,
                location: location,
                requirements: requirements,
                company: company
            });
        }
        else {
            const job = await Job.create({
                title,
                description,
                location,
                requirements,
                company,
                postedBy
            });
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.render('create', {
            err: "Error creating job",
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            requirements: req.body.requirements,
            company: req.body.company
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { jobid, title, description, location, requirements, company } = req.body;
        //validate
        if (!jobid || !title || !description || !location || !company) {
            return res.render('update', {
                err: "Please fill in all required fields",
                jobid: jobid,
                title: title,
                description: description,
                location: location,
                requirements: requirements,
                company: company
            });
        }

        const userID = req.session.user.id;
        console.log("hob ID: " + jobid);
        const job = await Job.findOne({ where: { id: jobid, postedBy: userID } });
        if (!job) {
            res.render('update', {
                err: 'The Job you are trying to update does not exist or you are not authorized to update it',
                jobid: jobid
            })
        }
        else {
            const updatedJob = await Job.update({
                title,
                description,
                location,
                requirements,
                company
            }, { where: { id: jobid } });
            res.redirect('/job/myjobs');
        }
    }
    catch (err) {
        console.log(err);
        res.render('update', {
            err: "Error updating job",
            jobid: req.body.jobid,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            requirements: req.body.requirements,
            company: req.body.company
        });
    }
}

exports.myJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { postedBy: req.session.user.id },
            raw: true,
            nest: true,
        });
        res.render('myjobs', {
            jobs: jobs,
            req: req
        });
    } catch (err) {
        console.log(err);
        res.render('myjobs', {
            err: "Error fetching jobs"
        });
    }
}

exports.updateGet = async (req, res) => {
    try {
        const userID = req.session.user.id;
        const job = await Job.findOne({ where: { id: req.params.id, postedBy: userID } });
        if (!job) {
            res.render('update', {
                err: 'The Job you are trying to update does not exist or you are not authorized to update it',
                jobid: req.params.id,
                req: req
            })
        }
        else {
            res.render('update', {
                jobid: job.id,
                title: job.title,
                description: job.description,
                location: job.location,
                requirements: job.requirements,
                company: job.company,
                req: req
            });
        }
    }
    catch (err) {
        console.log(err);
        res.render('update', {
            err: "Error updating job",
            jobid: req.params.id
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const userID = req.session.user.id;
        const job = await Job.findOne({ where: { id: req.params.id, postedBy: userID } });
        if (!job) {
            res.render('myjobs', {
                err: 'You are not authorized to delete this job',
                jobid: req.params.id
            })
        }
        else {
            const deletedJob = await Job.destroy({ where: { id: req.params.id } });
            res.redirect('/job/myjobs');
        }
    }
    catch (err) {
        console.log(err);
        res.render('myjobs', {
            err: "Error deleting job",
            jobid: req.params.id
        });
    }
}

exports.search = async (req, res) => {
    try {
        const { title, location } = req.query;
        let jobs = await Job.findAll({
            attributes: ['id', 'title', 'description', 'location', 'requirements', 'company', 'postedBy',
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN feedbacks.upvote is true then 1 else 0 end')), 'upvotes'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN feedbacks.downvote is true then 1 else 0 end')), 'downvotes'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN feedbacks.content is not null then 1 else 0 end')), 'comments']],
            include: [{
                model: User,
                required: true
            },
            {
                model: Feedback,
                required: false
            }],
            where: {},
            group: ['Job.id', 'User.id'],
            raw: true,
            nest: true,
        });

        if (title) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
        }
        if (location && location != 'All') {
            jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (req.session.user) {

            const jobIDs = jobs.map(job => job.id);
            const userID = req.session.user.id;

            const feedbacks = await Feedback.findAll({
                where: {
                    jobId: jobIDs,
                    postedBy: userID
                },
                raw: true,
                nest: true,
            });


            jobs = jobs.map(job => {
                const feed = feedbacks.filter(feedback => feedback.jobId == job.id);
                job.upvoted = feed.length ? (feed[0].upvote ? 'voted' : '') : false;
                job.downvoted = feed.length ? (feed[0].downvote ? 'voted' : '') : false;
                return job;
            });

            jobs = jobs.map(job => {
                job.user = job.user.email;
                return job;
            });

            res.render('search', {
                jobs: jobs,
                req: req
            });
        }
        else {
            jobs = jobs.map(job => {
                job.user = job.user.email;
                return job;
            });

            jobs = jobs.map(job => {
                job.upvoted = '';
                job.downvoted = '';
                return job;
            });

            res.render('search', {
                jobs: jobs,
                req: req
            });
        }
    } catch (err) {
        console.log(err);
        res.render('search', {
            err: "Error fetching jobs"
        });
    }
}

exports.view = async (req, res) => {
    try {
        const job = await Job.findOne({
            attributes: ['id', 'title', 'description', 'location', 'requirements', 'company', 'postedBy',
            ],
            include: [{
                model: User,
                required: true
            }],
            where: { id: req.params.id },
            raw: true,
            nest: true,
        });

        if (!job) {
            res.render('view', {
                err: 'The Job you are trying to view does not exist',
                jobid: req.params.id
            })
        }
        else {
            const feedbacks = await Feedback.findAll({
                include: [{
                    model: User,
                    required: true
                }],
                where: {
                    jobId: req.params.id,
                    content: {
                        [Op.ne]: null
                    }
                },
                raw: true,
                nest: true,
            });

            job.feedbacks = feedbacks;

            if (req.session.user) {
                const userID = req.session.user.id;

                const feed = feedbacks.filter(feedback => feedback.postedBy == userID);

                job.userContent = feed.length ? feed[0].content : '';

                job.user = job.user.email;

                console.log(job)

                res.render('view', {
                    job: job,
                    req: req
                });
            }
            else {
                job.user = job.user.email;
                job.userContent = '';

                console.log(job)
                res.render('view', {
                    job: job,
                    req: req
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.render('view', {
            err: "Error fetching job"
        });
    }
}