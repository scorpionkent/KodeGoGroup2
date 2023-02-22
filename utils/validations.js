const Joi = require('joi');

const checkLogin = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().min(6).email().required()
});

const checkReg = Joi.object({
    username: Joi.string().alphanum().min(6).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().lowercase().trim().min(6).email().required()
});
module.exports = {checkLogin, checkReg};