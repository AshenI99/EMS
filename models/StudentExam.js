const mongoose = require("mongoose");
const Joi = require("joi");


const studentExamSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    result: {
        type: String,
    },
    registeredDate: {
        type: Date,
        default: Date.now()
    }
})

const StudentExam = mongoose.model("StudentExam", studentExamSchema);

const validateStudentExam=(studentExam)=>{
    const studentExamJoiSchema = Joi.object({
        examId: Joi.objectId().required(),
        studentId: Joi.objectId().required(),
    })

    return studentExamJoiSchema.validate(studentExam);
}


exports.StudentExam = StudentExam;
exports.validate = validateStudentExam;