const mongoose = require("mongoose");
const Joi = require("joi");

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200
    },
    description: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500
    },
    venue: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 200
    },
    dateTime: {
        type: Date,
        required: true
    },
    closingDate: {
        type: Date,
        required: true
    }
})

const Exam = mongoose.model("Exam", examSchema);

const validateExam=(exam)=>{
    const examJoiSchema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(200)
            .required(),

        description: Joi.string()
            .min(5)
            .max(500)
            .required(),

        venue: Joi.string()
            .min(5)
            .max(200)
            .required(),

        dateTime: Joi.date()
            .required(),

        closingDate: Joi.date()
            .required(),
    })

    return examJoiSchema.validate(exam);
}


exports.Exam = Exam;
exports.validate = validateExam;