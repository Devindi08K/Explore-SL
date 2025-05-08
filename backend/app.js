const express = require('express');
const router = express.Router();

// Define your vehicle routes here
router.get('/vehicles', (req, res) => {
    res.send('List of vehicles');
});

router.post('/vehicles', (req, res) => {
    res.send('Add a new vehicle');
});

router.put('/vehicles/:id', (req, res) => {
    res.send(`Update vehicle with ID ${req.params.id}`);
});

router.delete('/vehicles/:id', (req, res) => {
    res.send(`Delete vehicle with ID ${req.params.id}`);
});

module.exports = router;