const _ = require("lodash");
const express= require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const {Exam} = require("../models/Exam")
const { StudentExam , validate } = require("../models/StudentExam");
const {Student} = require("../models/Student");

router.get('/student/:id', [auth, validateObjectId] , async (req, res)=>{
    const studentExams = await StudentExam.find({studentId :req.params.id}).populate("examId");
    if(!studentExams) return res.status(404).send("Student with the given id is not registered for any exams");

    res.send(studentExams);
});

router.get('/exam/:id', [auth, admin, validateObjectId] , async (req, res)=>{
    const studentExams = await StudentExam.find({examId: req.params.id}).populate("studentId");
    if(!studentExams) return res.status(404).send("Students are not registered for the given exam");

    res.send(studentExams);
});

router.put('/exam/:id', [auth, admin, validateObjectId], async (req, res)=>{
    if(!req.body.results) return res.status(400).send("Results are required");

    const exam = await Exam.findById(req.params.id);
    if(!exam) return res.status(400).send("Invalid exam ID");

    const results = req.body.results;

    let savedResults = [];
    for(let i=0; i<results.length; i++){
        const studentExam = await StudentExam.findOneAndUpdate(
            { _id: results[i]._id, studentId: results[i].studentId, examId: req.params.id },
            { result: results[i].result },
            { new: true }
        );
        if(!studentExam) return res.status(400).send("Invalid ID");

        savedResults.push(studentExam);
    }

    res.send(savedResults);
});

module.exports = router;