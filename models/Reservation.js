const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
customerName:{
    type: String, 
    required: true, 
    max: 350, 
    min: 6
},
customerEmail:{
    type: String, 
    required: true, 
    max: 350, 
    min: 6
},
customerMobile:{
    type: String, 
    required: true, 
    max: 100, 
    min: 6
},
checkInDate:{
    type: Date, 
    required: true
},
checkOutDate:{
    type: Date, 
    required: true
},
roomId:{
    type: String, 
    required: true,
    max: 100, 
    min: 6
},
date:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Reservation', reservationSchema);
