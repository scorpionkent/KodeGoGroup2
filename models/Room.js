const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
roomName:{
    type: String,
    required: true, 
    max: 150,
    min: 6
},
roomPic:{
    type: String, 
    required: true, 
    max: 350, 
    min: 6
},
capacity:{
    type: Number, 
    required: true, 
    max: 50, 
    min: 1
},
price:{
    type: Number, 
    required: true, 
    max: 150000, 
    min: 1
},
category:{
    type: String,
    required: true, 
    max: 150,
    min: 6
},
available:{
    type: Boolean,
    required: true, 
    max: 150,
    min: 6
},
date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Room', roomSchema);
