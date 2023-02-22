//require('dotenv').config();
const jwt = require('jsonwebtoken');
//const cl = require('../utils/logAlias')

//produce token
function genToken(payload) {
// Generate the JWT
const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });
return token;
}

let checkToken = (req, res, next)=>{
// Get JWT token from the cookie
 const token = req.cookies.token;
 // Verify JWT token
 if (!token) {
  res.redirect('/login');
 }
 try {
   const data = jwt.verify(token, process.env.TOKEN_SECRET);
   req.user = data;
  //  cl(req.user.username);
   res.status(200);
   next();
 } catch (err) {
   res.status(401).send("Invalid Token or Token Expired");
  //  cl(err);
 }
}

module.exports = {genToken, checkToken};