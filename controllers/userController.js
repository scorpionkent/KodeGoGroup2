const User = require('../models/User');
// const bcrypt = require('bcryptjs');
const validateMe = require('../utils/validations');
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');

const userLogin = async(req, res)=>{
    let body = req.body;
    //check if existing email
    const checkData = await User.findOne({email: req.body.email})
        if(!checkData) return res.status(400).render("login",{title: 'Login', message: 'Email or Password is incorrect', isLogged: false});
    //validate password
    // const userPass = await bcrypt.compare(req.body.password, checkData.password)
    let userPass = false;
    if (req.body.password == checkData.password){
        userPass = true;
    }
    if(!userPass) return res.status(400).render("login",{title: 'Login', message: 'Email or Password is incorrect', isLogged: false});
    const token = auth.genToken({username: checkData.username, email: checkData.email});
    // Store JWT token in a cookie
    res.cookie("token", token, { httpOnly: true });
    // res.status(200).redirect("/room");
    res.render('home', {title: "Home", isLogged: true});
    // cl("Login Success!\nToken Granted To: "+checkData.username);
}

const userLogout = (req, res)=>{
res.clearCookie('token');
// cl({ message: 'Logout successful' });
res.status(200).redirect('/login');
}

const userLoginHome = (req, res)=>{
    res.render("login", {title: 'Login', message: false, isLogged: false });
}

const userRegHome = (req, res)=>{
    let isLogged = false;
    const isTokenValid = () => {
        const token = req.cookies.token;
        if (!token) {
            return;
        }
        try {
            const data = jwt.verify(token, process.env.TOKEN_SECRET);
            isLogged = true;
        } catch (error) {
            return;
        }
    };
    isTokenValid();

    res.render("register", {title: 'Register', message: false, isLogged });
}
const userReg =  async(req, res)=>{
    //validate registration
    const validateData = validateMe.checkReg.validate(req.body);
        if(validateData.error) return res.status(400).render('register',{title: 'Register', message: validateData.error.details[0].message, isLogged: true});
    //check if user name exist
    const userName = await User.findOne({username: req.body.username}); 
        if(userName) return res.status(400).render('register',{title: 'Register', message:`Choose another username!`, isLogged: true}); 
    //check if email exist
    const userEmail = await User.findOne({email: req.body.email});
        if(userEmail) return res.status(400).render('register',{title: 'Register', message:`Email exists, Please Login!`, isLogged: true}); 
    //Encrypt Password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        username: req.body.username,
        // password: hashedPass,
        password: req.body.password,
        email: req.body.email
    });
    try {
        await newUser.save();
        console.log('New User Added!');
        // res.status(201).redirect('/login');
        res.render('home', {title: "Home", isLogged: false});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {userLogin, userLogout, userReg, userLoginHome, userRegHome}