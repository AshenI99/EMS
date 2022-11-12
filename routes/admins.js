const _ = require("lodash");
const express= require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

const { Admin, validate } = require("../models/Admin")

router.get('/', [auth, admin], async (req, res)=>{
    const admins = await Admin.find().sort("name");
    res.send(admins);
});

router.post('/', [auth, admin], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const savingAdmin = new Admin({
            ..._.pick(req.body, ["name","email", "password"]),
        })
    await savingAdmin.save();

    res.send(savingAdmin);
});

router.put('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const savingAdmin = {
        ..._.pick(req.body, ["name","email", "password"]),
    };

    const savedAdmin = await Admin.findByIdAndUpdate(req.params.id, savingAdmin, { new: true });
    if(!savedAdmin) return res.status(404).send("The admin with the given id is not found");

    res.send(savedAdmin);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const deletedAdmin = await Admin.findByIdAndRemove(req.params.id);
    if(!deletedAdmin) return res.status(404).send("The admin with the given id is not found");

    res.send(deletedAdmin);
});

module.exports = router;