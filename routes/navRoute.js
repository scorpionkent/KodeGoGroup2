const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.redirect('/home');
});

router.get('/home', (req, res) => {
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

    res.render('home', {title: "Home", isLogged});
});

router.get('/about', (req, res) => {
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

    res.render('about', {title: "About", isLogged});
});

router.get('/contact', (req, res) => {
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

    res.render('contact', {title: "Contact", isLogged});
});

module.exports = router;