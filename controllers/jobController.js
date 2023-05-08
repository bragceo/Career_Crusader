const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Job = require('../models/job');
const User = require('../models/user');

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
            res.redirect('/');
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
                company: job.company
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
            include: [{
                model: User,
                required: true
            }],
            where: {},
            raw: true,
            nest: true,
        });

        if (title) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
        }
        if (location && location != 'All') {
            jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
        }

        jobs = jobs.map(job => {
            job.user = job.user.email;
            return job;
        });

        res.render('search', {
            jobs: jobs,
            req: req
        });
    } catch (err) {
        console.log(err);
        res.render('search', {
            err: "Error fetching jobs"
        });
    }
}