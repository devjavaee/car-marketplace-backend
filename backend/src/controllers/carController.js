const Car = require('../models/Car');

// Créer une voiture
const createCar = async (req, res) => {
  try {
    const carData = {
      ...req.body,
      seller: req.user.id,  // Lien avec l'utilisateur connecté
    };

    const car = await Car.create(carData);

    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Lister toutes les voitures
const getCars = async (req, res) => {
  try {
    // 📄 Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔍 Filtres dynamiques
    const filters = {};

    if (req.query.brand) {
      filters.brand = req.query.brand;
    }

    if (req.query.year) {
      filters.year = parseInt(req.query.year);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};

      if (req.query.minPrice) {
        filters.price.$gte = parseInt(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        filters.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    // 📊 Tri
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const sortOptions = {
      [sortField]: sortOrder,
    };

    // 📦 Requête Mongo
    const total = await Car.countDocuments(filters);

    const cars = await Car.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name email');

    // 📤 Réponse
    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      results: cars.length,
      cars,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Détail d'une voiture
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Modifier une voiture
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    // Vérifier propriétaire
    if (
  car.seller.toString() !== req.user.id &&
  req.user.role !== 'admin'
) {
  return res.status(403).json({ message: 'Accès interdit' });
}

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une voiture
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    if (
  car.seller.toString() !== req.user.id &&
  req.user.role !== 'admin'
) {
  return res.status(403).json({ message: 'Accès interdit' });
}


    await car.deleteOne();

    res.status(200).json({ message: 'Voiture supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
