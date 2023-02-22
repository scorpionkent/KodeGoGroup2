const Reservation = require('../models/Reservation');
const Rooms = require('../models/Room');
const jwt = require('jsonwebtoken');

// get all reservations
const reservation_index = async (req, res) => {
    const limit = 5;
    const page = 1;
    const search = '';

    const total = await Reservation.countDocuments({
        customerName: {$regex: search, $options: 'i'}
    });

    Reservation.find().sort({createdAt: 1})
    .then((result) => {
        res.render('reservation',{title:"RESERVATIONS", data: result, total, limit, page, search, isLogged: false});
    })
    .catch(err => console.log(err))
}

// get all rooms
const rooms_index = async (req, res) => {
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
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';

        //total search items
        const total = await Rooms.countDocuments({
            available: true, roomName: {$regex: search, $options: 'i'}
        });

        //check/ search from database 
        const rooms = await Rooms.find({
            $or: [{available: true, roomName: {$regex: search, $options: 'i'}},
                {available: true, category: {$regex: search, $options: 'i'}}
            ]})
        .limit(limit)
        .skip(page * limit);

        res.render('reservation-add',{title:"NEW BOOKING", data: rooms, total, limit, page: page+1, search, isLogged});
    } catch (error) {
        console.log(error);
    }
}

// add reservation
const reservation_add = async (req, res) => {
    // console.log(req.body);

    const roomId = req.body.roomId
    let roomUpdate = await Rooms.findByIdAndUpdate(roomId, {
        available: false
    })

    if(!roomUpdate) return res.status(404).send(`Add Reservation, can't update availability of room`);

    const reservation = new Reservation(req.body)
    reservation.save()
    //.then(result => res.redirect("/reservation"))
    .then(result => res.redirect("/reservation"))
    .catch(err => console.log(err))
}

// find reservation
const reservation_find = (req,res) => {
    const id = req.params.id;
    let reservations = null;

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

    Reservation.findById(id)
    .then((result) => {
        if(result){
            reservations = result;
            Rooms.findById(reservations.roomId)
            .then((results) => {
                if(results){
                    let viewOrEdit = req.params.viewOrEdit;
                    if(viewOrEdit=='view'){
                        res.render('reservation-view', {data: reservations, rooms: results, title:'VIEW RESERVATION', isLogged});
                    }else if(viewOrEdit=='edit'){
                        res.render('reservation-edit', {data: reservations, rooms: results, title:'EDIT RESERVATION', isLogged});
                    }
                    console.log('Get a record');
                }else{
                    res.status(400).send('Id does not exist');
                    // res.render('noPageFound', {title:'PAGE NOT FOUND'});
                }
            })
            .catch(err => console.log(err))
        }else{
            res.status(400).send('Id does not exist');
            // res.render('noPageFound', {title:'PAGE NOT FOUND'});
        }
    })
    .catch(err => console.log(err))
}

// find reservation for editing
// const reservation_edit = async (req,res) => {
//     const id = req.params.id;
//     let reservations = null;
//     let roomsAll = null;
//     let room = null;

//     try {
//         const page = parseInt(req.query.page) - 1 || 0;
//         const limit = parseInt(req.query.limit) || 5;
//         const search = req.query.search || '';

//         //total search items
//         const total = await Rooms.countDocuments({
//             roomName: {$regex: search, $options: 'i'}
//         });

//         //check/ search from database 
//         roomsAll = await Rooms.find({
//             $or: [{roomName: {$regex: search, $options: 'i'}},
//                 {category: {$regex: search, $options: 'i'}}
//             ]})
//         .limit(limit)
//         .skip(page * limit);

//         //res.render('reservation-add',{title:"NEW BOOKING", data: rooms, total, limit, page: page+1, search});

//         Reservation.findById(id)
//         .then((result) => {
//             if(result){
//                 reservations = result;
//                 Rooms.findById(reservations.roomId)
//                 .then((results) => {
//                     if(results){
//                         room = results;
//                         res.render('reservation-edit', {data: reservations, roomsAll, room, total, limit, page: page+1, search, title:'VIEW RESERVATION'});
                        
//                         console.log('Get a record');
//                     }else{
//                         res.status(400).send('Id does not exist');
//                         // res.render('noPageFound', {title:'PAGE NOT FOUND'});
//                     }
//                 })
//                 .catch(err => console.log(err))
//             }else{
//                 res.status(400).send('Id does not exist');
//                 // res.render('noPageFound', {title:'PAGE NOT FOUND'});
//             }
//         })
//         .catch(err => console.log(err))

//     } catch (error) {
//         console.log(error);
//     }
// }

// update reservation
const reservation_update = async (req, res) => {
    let id = req.params.id;

    let reservationUpdate = await Reservation.findByIdAndUpdate(id, {
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        customerMobile: req.body.customerMobile,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        roomId: req.body.roomId
    })

    if(!reservationUpdate) return res.status(404).send(`Reservation can't be updated`);
    res.redirect('/reservation')
}

// delete reservation
const reservation_delete = async (req, res) => {
    console.log('delete record');
    const id = req.params.id;  
    const roomId = req.params.roomId;
       
    const deleteReservation = await Reservation.findByIdAndDelete(id);

    if(!deleteReservation){
        return res.status(404).send(`Reservation can't be deleted`);
    }

    const roomUpdate = await Rooms.findByIdAndUpdate(roomId, {
        available: true
    })

    if(!roomUpdate) return res.status(404).send(`Delete Reservation, can't update availability of room`);

    res.redirect('/reservation');
}

// search reservation
const reservation_search =  async (req, res) => {
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

    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';

        //total search items
        const total = await Reservation.countDocuments({
            $or: [{customerName: {$regex: search, $options: 'i'}}, 
            {customerEmail: {$regex: search, $options: 'i'}}]
        });

        //check/ search from database 
        const reservations = await Reservation.find({
            $or: [{customerName: {$regex: search, $options: 'i'}},
                {customerEmail: {$regex: search, $options: 'i'}}
            ]})
        .limit(limit)
        .skip(page * limit);

        res.render('reservation',{title:"RESERVATIONS", data: reservations, total, limit, page: page+1, search, isLogged});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    reservation_index,
    rooms_index,
    reservation_add,
    reservation_find,
    reservation_update,
    reservation_delete,
    reservation_search
}