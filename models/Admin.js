const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 100
    },
    email: {
        type: String,
        unique: true,
        maxLength: 255,
        minLength: 5
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024
    }
});

adminSchema.methods.generateAuthToken = function () {
    let dataObj = _.pick(this, ["_id", "name", "email"]);
    dataObj.isAdmin = true;

    return jwt.sign(dataObj, config.get("jwtPrivateKey"));
}

const Admin = mongoose.model("Admin", adminSchema);

const validateAdmin = (admin) => {

    const adminJoiSchema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(100),

        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),

        password: Joi.string()
            .min(8)
            .max(1024)
            .required()
    })

    return adminJoiSchema.validate(admin);
}

exports.Admin = Admin;
exports.validate = validateAdmin;