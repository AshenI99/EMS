const _ = require("lodash");
const express= require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Exam, validate } = require("../models/Exam")

router.get('/', async (req, res)=>{
    const exams = await Exam.find().sort("closingDate");
    res.send(exams);
});

router.post('/', [auth, admin], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const savingExam = new Exam({
            ..._.pick(req.body, ["name", "venue", "dateTime", "closingDate", "description"]),
        })
    await savingExam.save();

    res.send(savingExam);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const savingExam = {
        ..._.pick(req.body, ["name", "venue", "dateTime", "closingDate", "description"]),
    };

    const savedExam = await Exam.findByIdAndUpdate(req.params.id, savingExam, { new: true });
    if(!savedExam) return res.status(404).send("The exam with the given id is not found");

    res.send(savedExam);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const deletedExam = await Exam.findByIdAndRemove(req.params.id);
    if(!deletedExam) return res.status(404).send("The exam with the given id is not found");

    res.send(deletedExam);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const exam = await Exam.findById(req.params.id);
    if(!exam) return res.status(404).send("The exam with the given id is not found");

    res.send(exam);
});

router.get('/unfinished-exams', [auth, admin], async (req, res)=>{
    const exam = await Exam.find({ isFinished: false });
    res.send(exam);
});

module.exports = router;