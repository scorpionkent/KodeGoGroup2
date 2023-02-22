//import
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();
const cors = require('cors');
const cookieParser = require("cookie-parser");

const navRouter = require('./routes/navRoute');
const roomRouter = require('./routes/roomRoute');
const reservationRouter = require('./routes/reservationRoute');
const userRouter = require('./routes/userRoute');

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

//static files
app.use(express.static('public'));
app.use('/public', express.static(__dirname+ 'public'));

//engine templates
app.set('views', './views');
app.set('view engine', 'ejs');

//routes
app.use('/', navRouter);
app.use('/room', roomRouter);
app.use('/reservation', reservationRouter);
app.use('/', userRouter);

//checking connection
mongoose.connect(process.env.DB_CONNECT, ()=>{
    console.log('database connection is working')
    });

//checking server
const port = 8000;
app.listen(port,()=>{
    console.log(`The server is running in port ${port}`);
});