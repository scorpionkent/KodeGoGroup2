const Rooms = require('../models/Room');
const jwt = require('jsonwebtoken');

// get all rooms
const rooms_index = async (req, res) => {
    const limit = 5;
    const page = 1;
    const search = '';

    const total = await Rooms.countDocuments({
        roomName: {$regex: search, $options: 'i'}
    });

    Rooms.find().sort({createdAt: 1})
    .then((result) => {
        res.render('room',{title:"ROOMS", data: result, total, limit, page, search});
    })
    .catch(err => console.log(err))
}

// add room
const rooms_add = (req, res) => {
    // console.log(req.body);
    const room = new Rooms(req.body)
    room.save()
    .then(result => res.redirect("/room"))
    .catch(err => console.log(err))
}

// find room
const rooms_find = (req,res) => {
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

    const id = req.params.id;
    Rooms.findById(id)
    .then((result) => {
        if(result){
            let viewOrEdit = req.params.viewOrEdit;
            if(viewOrEdit=='view'){
                res.render('room-view', {data: result, title:'VIEW ROOM', isLogged});
            }else if(viewOrEdit=='edit'){
                res.render('room-edit', {data: result, title:'EDIT ROOM', isLogged});
            }
            console.log('Get a record');
        }else{
            res.status(400).send('Id does not exist');
            // res.render('noPageFound', {title:'PAGE NOT FOUND'});
        }
    })
    .catch(err => console.log(err))
}

// update room
const rooms_update = async (req, res) => {
    let id = req.params.id;

    let roomUpdate = await Rooms.findByIdAndUpdate(id, {
        roomName: req.body.roomName,
        roomPic: req.body.roomPic,
        capacity: req.body.capacity,
        price: req.body.price,
        category: req.body.category,
        available: req.body.available
    })

    if(!roomUpdate) return res.status(404).send(`Room can't be updated`);
    res.redirect('/room')
}

// delete room
const rooms_delete = async (req, res) => {
    console.log('delete record');
    const id = req.params.id;

    const deleteRoom = await Rooms.findByIdAndDelete(id);

    if(!deleteRoom){
        return res.status(404).send(`Room can't be deleted`);
    }
    res.redirect('/room');
}

// search room
const rooms_search =  async (req, res) => {
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
            $or: [{roomName: {$regex: search, $options: 'i'}},
                {category: {$regex: search, $options: 'i'}}
            ]
        });

        //check/ search from database 
        const rooms = await Rooms.find({
            $or: [{roomName: {$regex: search, $options: 'i'}},
                {category: {$regex: search, $options: 'i'}}
            ]})
        .limit(limit)
        .skip(page * limit);

        res.render('room',{title:"ROOMS", data: rooms, total, limit, page: page+1, search, isLogged});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    rooms_index,
    rooms_add,
    rooms_find,
    rooms_update,
    rooms_delete,
    rooms_search
}