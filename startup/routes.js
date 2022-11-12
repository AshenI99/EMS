const express = require("express");

const admins = require("../routes/admins");
const exams = require("../routes/exams");
const students = require("../routes/students");
const studentExams = require("../routes/studentExams");
const user = require("../routes/user");
const auth = require("../routes/auth");

const error = require("../middlewares/error");

module.exports = function (app) {
    app.use(express.json());

    app.use("/api/admins", admins);
    app.use("/api/students", students);
    app.use("/api/exams", exams);
    app.use("/api/student-exams", studentExams);
    app.use("/api/user", user);
    app.use("/api/auth", auth);

    app.use(error);
}