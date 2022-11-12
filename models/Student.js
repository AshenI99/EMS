const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

const studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength:50,
        minLength:5
    },
    lastName: {
        type: String,
        required: true,
        maxLength:50,
        minLength:5
    },
    institute: {
        type: String,
        required: true,
        maxLength:150,
        minLength:5
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    mobile: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024
    },
})

studentSchema.methods.generateAuthToken = function () {
    let dataObj = _.pick(this, ["_id", "firstName", "lastName", "email"]);
    dataObj.isAdmin = false;

    return jwt.sign(dataObj, config.get("jwtPrivateKey"));
}

const Student = mongoose.model("Student", studentSchema);

const validateStudent = (student, isAdmin) => {

    const studentJoiSchema = Joi.object({
        firstName: Joi.string()
            .max(50)
            .min(5)
            .required(),

        lastName: Joi.string()
            .max(50)
            .min(5)
            .required(),

        institute: Joi.string()
            .max(50)
            .min(5)
            .required(),

        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),

        mobile: Joi.string()
            .min(10)
            .max(20)
            .required(),

        password: Joi.string()
            .min(8)
            .max(1024)
            .required()
    })

    const studentJoiSchema2 = Joi.object({
        firstName: Joi.string()
            .max(50)
            .min(5)
            .required(),

        lastName: Joi.string()
            .max(50)
            .min(5)
            .required(),

        institute: Joi.string()
            .max(50)
            .min(5)
            .required(),

        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),

        mobile: Joi.string()
            .min(10)
            .max(20)
            .required(),
    })

    if(isAdmin){
        return studentJoiSchema2.validate(student);
    } else {
        return studentJoiSchema.validate(student);
    }
}

exports.Student = Student;
exports.validate = validateStudent;