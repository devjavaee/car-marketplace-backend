import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [editingCarId, setEditingCarId] = useState(null);

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data.cars);
    } catch (err) {
      setError('Impossible de charger les voitures');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    if (editingCarId) {
      // ✏️ UPDATE
      await api.put(`/cars/${editingCarId}`, {
        brand,
        model,
        year: Number(year),
        price: Number(price),
      });
      setSuccess('Voiture mise à jour');
    } else {
      // ➕ CREATE
      await api.post('/cars', {
        brand,
        model,
        year: Number(year),
        price: Number(price),
      });
      setSuccess('Voiture ajoutée');
    }

    setBrand('');
    setModel('');
    setYear('');
    setPrice('');
    setEditingCarId(null);

    fetchCars();
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur');
  }
};
// supp
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    'Êtes-vous sûr de vouloir supprimer cette voiture ?'
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/cars/${id}`);
    fetchCars();
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur suppression');
  }
};



  return (
    <div>
      <h2>Mon Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Ajouter une voiture</h3>

      <form onSubmit={handleSubmit}>
        <input placeholder="Marque" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <input placeholder="Modèle" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input type="number" placeholder="Année" value={year} onChange={(e) => setYear(e.target.value)} required />
        <input type="number" placeholder="Prix" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit">Ajouter</button>
        <button type="submit">
        {editingCarId ? 'Mettre à jour' : 'Ajouter'}
        </button>

      </form>

      <h3>Mes voitures</h3>

      {cars.length === 0 ? (
        <p>Aucune voiture</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car._id}>
              {car.brand} {car.model} - {car.year} - {car.price} €
              <button
                onClick={() => {
                setEditingCarId(car._id);
                setBrand(car.brand);
                setModel(car.model);
                setYear(car.year);
                setPrice(car.price);
                    }}
                >
                    Modifier
                </button>
                <button
                    onClick={() => handleDelete(car._id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                    >
                    Supprimer
                    </button>

            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
