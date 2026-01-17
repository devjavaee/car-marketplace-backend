import { useEffect, useState } from 'react';
import api from '../api/axios';
import CarForm from '../components/CarForm';
import CarList from '../components/CarList';

function Dashboard() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [editingCarId, setEditingCarId] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState({});

 const fetchCars = async () => {
  try {
    const res = await api.get('/cars/my');
    setCars(res.data.cars); // ✅ CORRECT
  } catch (err) {
    setError('Impossible de charger les voitures');
  }
};



  useEffect(() => {
    fetchCars();
  }, []);

  const resetForm = () => {
    setBrand('');
    setModel('');
    setYear('');
    setPrice('');
    setEditingCarId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCarId) {
        await api.put(`/cars/${editingCarId}`, {
          brand,
          model,
          year: Number(year),
          price: Number(price),
        });
        setSuccess('Voiture mise à jour');
      } else {
        await api.post('/cars', {
          brand,
          model,
          year: Number(year),
          price: Number(price),
        });
        setSuccess('Voiture ajoutée');
      }

      resetForm();
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (car) => {
    setEditingCarId(car._id);
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setPrice(car.price);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return;
    await api.delete(`/cars/${id}`);
    fetchCars();
  };

  const handleFileChange = (e, carId) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => ({ ...prev, [carId]: file }));
  };

  const handleUpload = async (carId) => {
    const file = selectedFiles[carId];
    if (!file) return alert('Sélectionne un fichier');

    const formData = new FormData();
    formData.append('image', file);

    await api.post(`/cars/${carId}/images`, formData);
    fetchCars();
  };

  const handleDeleteImage = async (carId, imageId) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    await api.delete(`/cars/${carId}/images/${imageId}`);
    fetchCars();
  };

  return (
    <div>
      <h2>Mon Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>{editingCarId ? 'Modifier la voiture' : 'Ajouter une voiture'}</h3>

      <CarForm
        brand={brand}
        model={model}
        year={year}
        price={price}
        editingCarId={editingCarId}
        setBrand={setBrand}
        setModel={setModel}
        setYear={setYear}
        setPrice={setPrice}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <h3>Mes voitures</h3>

      <CarList
        cars={cars}
        editingCarId={editingCarId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpload={handleUpload}
        onFileChange={handleFileChange}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
}

export default Dashboard;
