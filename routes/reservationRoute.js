const reservationController = require('../controllers/reservationController')
const router = require('express').Router();

//Reservation Page / Get all
// router.get("/", reservationController.reservation_index);
// use reservation search

// Reservation Add page
router.get("/add", reservationController.rooms_index);

// Reservation Add Record
router.post("/addReservation", reservationController.reservation_add);

// Delete Reservation
router.get("/delete/:id/:roomId", reservationController.reservation_delete);

// Find Reservation
router.get("/:viewOrEdit/:id", reservationController.reservation_find);

// Update Reservation
router.post("/updateReservation/:id", reservationController.reservation_update)

// Search Reservation
router.get("/", reservationController.reservation_search)

module.exports = router;