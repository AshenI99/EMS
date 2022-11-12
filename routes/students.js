const _ = require("lodash");
const express= require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Student, validate } = require("../models/Student")

router.get('/', [auth, admin], async (req, res)=>{
    const students = await Student.find().sort("firstName");
    res.send(students);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body, true);
    if(error) return res.status(400).send(error.details[0].message);

    const savingStudent = {
        ..._.pick(req.body, ["firstName", "lastName", "institute", "email", "mobile", "password"]),
    };

    const savedStudent = await Student.findByIdAndUpdate(req.params.id, savingStudent, { new: true });
    if(!savedStudent) return res.status(404).send("The student with the given id is not found");

    res.send(savedStudent);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const deletedStudent = await Student.findByIdAndRemove(req.params.id);
    if(!deletedStudent) return res.status(404).send("The student with the given id is not found");

    res.send(deletedStudent);
});

module.exports = router;