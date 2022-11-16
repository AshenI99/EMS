const _ = require("lodash");
const express= require("express");
const moment = require("moment");
const router = express.Router();


const auth = require("../middlewares/auth");
const validateObjectId = require("../middlewares/validateObjectId");

const { Exam } = require("../models/Exam")
const { StudentExam } = require("../models/StudentExam");
const { Student } = require("../models/Student");


router.get('/my-details', [auth], async (req, res)=>{
    let student = await Student.findById(req.user._id);

    res.send(student);
});

router.get('/registered-exams', [auth], async (req, res)=>{
    let results = await StudentExam.find({ studentId: req.user._id }).populate("studentId").populate("examId");
    if(!results) results = [];

    res.send(results);
});

router.get('/exam-results', [auth], async (req, res)=>{
    let inputDate = new Date();
    let results = await StudentExam.find({ studentId: req.user._id })
        .populate("studentId").populate("examId")
        .then((stExms) => {
            return stExms.filter((stExm) => moment().diff(stExm.dateTime, 'days') < 1)
        })
    if(!results) results = [];

    res.send(results);
});

router.get('/exam-results/:id', [auth, validateObjectId], async (req, res)=>{
    const exam = await Exam.findById(req.params.id);
    if(!exam) return res.status(404).send("The exam with the given id is not found");

    const studentExam = await StudentExam.findOne({ examId: req.params.id, studentId: req.user._id }).populate("studentId").populate("examId");

    res.send(studentExam);
});

router.post('/register-exam/:id', [auth, validateObjectId], async (req, res)=>{

    const exam = await Exam.findById(req.params.id);
    if(!exam) return res.status(400).send("Invalid exam ID");

    const savingStudentExam = new StudentExam({
        examId: req.params.id,
        studentId: req.user._id,
        registeredDate: Date.now()
    })
    await savingStudentExam.save();

    res.send(savingStudentExam);
});

module.exports = router;