const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require('../controllers/carController');

router.post('/', auth, createCar);
router.get('/', getCars);
router.get('/:id', getCarById);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, deleteCar);


module.exports = router;
