const Car = require('../models/Car');
const cloudinary = require('../config/cloudinaryConfig');
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
const uploadCarImage = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });

    // Vérifier propriétaire ou admin
    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    if (!req.file) return res.status(400).json({ message: 'Image manquante' });

    // Upload sur Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'cars' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        // Ajouter image à la voiture
        car.images = car.images || [];
        car.images.push({ url: result.secure_url, public_id: result.public_id });

        await car.save();

        res.status(200).json({ car });
      }
    );

    // Passer le buffer à Cloudinary
    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// upload iages 
const uploadCarImages = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image envoyée' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// supp image 
const deleteCarImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    const image = car.images.id(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    await cloudinary.uploader.destroy(image.public_id);

    image.deleteOne();
    await car.save();

    res.status(200).json({ message: 'Image supprimée', images: car.images });
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
  uploadCarImage,
  uploadCarImages,
  deleteCarImage,
};
