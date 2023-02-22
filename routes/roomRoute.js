const roomController = require('../controllers/roomController')
const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Rooms Page / Get all
// router.get("/", roomController.rooms_index);
// use room search

// Rooms Add page
router.get("/add", (req, res)=> {
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

    res.render("room-add",{title: "ADD ROOMS", isLogged});
});

// Rooms Add record
router.post("/addRoom", roomController.rooms_add);

// Delete Room
router.get("/delete/:id", roomController.rooms_delete)

// Find Room
router.get("/:viewOrEdit/:id", roomController.rooms_find)

// Update Room
router.post("/updateRoom/:id", roomController.rooms_update)

// Search Room
router.get("/", roomController.rooms_search)

module.exports = router;