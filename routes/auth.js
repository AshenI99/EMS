const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const {Admin} = require("../models/Admin");
const {Student, validate} = require("../models/Student");



router.post('/login', async (req, res)=>{
    const { error } = loginValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Admin.findOne({ email : req.body.email });
    if(!user){
        user = await Student.findOne({ email : req.body.email });
    }
    if(!user) return res.status(400).send("Invalid email or password");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.setHeader('x-auth', token).send(token);
});


router.post('/signup', async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Student.findOne({ email : req.body.email });
    if(user) return res.status(400).send("Email is already used");

    let savingStudent = new Student({
        ..._.pick(req.body, ["firstName", "lastName", "institute", "email", "mobile", "password"]),
    })

    const salt = await bcrypt.genSalt(10);
    savingStudent.password = await bcrypt.hash(savingStudent.password, salt);

    await savingStudent.save();

    res.send(savingStudent);
});

const loginValidate = (auth) => {

    const authJoiSchema = Joi.object({
        email: Joi.string().max(255).email().required(),
        password: Joi.string().max(1024).required()
    })

    return authJoiSchema.validate(auth);
}


module.exports = router;