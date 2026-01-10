const Car = require('../models/Car');
const cloudinary = require('../config/cloudinaryConfig');
const asyncHandler = require('../middlewares/asyncHandler');

// ==========================
// Créer une voiture
// ==========================
const createCar = asyncHandler(async (req, res) => {
  const carData = {
    ...req.body,
    seller: req.user.id,
  };

  const car = await Car.create(carData);
  res.status(201).json(car);
});

// ==========================
// Lister les voitures (pagination + filtres)
// ==========================
const getCars = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.brand) {
    filters.brand = req.query.brand;
  }

  if (req.query.year) {
    filters.year = parseInt(req.query.year);
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {};
    if (req.query.minPrice) filters.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) filters.price.$lte = parseInt(req.query.maxPrice);
  }

  const sortField = req.query.sort || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const total = await Car.countDocuments(filters);

  const cars = await Car.find(filters)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate('seller', 'name email');

  res.status(200).json({
    total,
    page,
    pages: Math.ceil(total / limit),
    results: cars.length,
    cars,
  });
});

// ==========================
// Détail d'une voiture
// ==========================
const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  res.status(200).json(car);
});

// ==========================
// Modifier une voiture
// ==========================
const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès interdit');
  }

  const updatedCar = await Car.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedCar);
});

// ==========================
// Supprimer une voiture
// ==========================
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès interdit');
  }

  await car.deleteOne();
  res.status(200).json({ message: 'Voiture supprimée' });
});

// ==========================
// Upload 1 image
// ==========================
const uploadCarImage = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès interdit');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Image manquante');
  }

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'cars' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(req.file.buffer);
  });

  car.images.push({
    url: result.secure_url,
    public_id: result.public_id,
  });

  await car.save();

  res.status(200).json({ car });
});

// ==========================
// Upload plusieurs images
// ==========================
const uploadCarImages = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès interdit');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Aucune image envoyée');
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'cars' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  car.images.push(...uploadedImages);
  await car.save();

  res.status(200).json({ images: car.images });
});

// ==========================
// Supprimer une image
// ==========================
const deleteCarImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const car = await Car.findById(id);
  if (!car) {
    res.status(404);
    throw new Error('Voiture non trouvée');
  }

  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès interdit');
  }

  const image = car.images.id(imageId);
  if (!image) {
    res.status(404);
    throw new Error('Image non trouvée');
  }

  await cloudinary.uploader.destroy(image.public_id);

  image.deleteOne();
  await car.save();

  res.status(200).json({ message: 'Image supprimée', images: car.images });
});

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  uploadCarImage,
  uploadCarImages,
  deleteCarImage,
};
