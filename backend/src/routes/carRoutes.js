const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { contactSeller } = require('../controllers/contactController');

const {
  createCar,
  getCars,
  getMyCars,
  getCarById,
  updateCar,
  deleteCar,
  uploadCarImage,
  uploadCarImages,
  deleteCarImage,

} = require('../controllers/carController');

router.post('/', auth, createCar);
router.get('/', getCars);
router.get('/my', auth, getMyCars);
// 📩 Contacter le vendeur (auth requis)
router.post('/:id/contact', auth, contactSeller);
router.get('/:id', getCarById);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, deleteCar);
router.post(
  '/:id/images/multiple',
  auth,
  upload.array('images', 5),
  uploadCarImages
);

router.delete(
  '/:id/images/:imageId',
  auth,
  deleteCarImage
);

//upload


router.post('/:id/images', auth, upload.single('image'), uploadCarImage);


module.exports = router;
