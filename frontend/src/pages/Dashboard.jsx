import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [selectedFiles, setSelectedFiles] = useState({});

  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [editingCarId, setEditingCarId] = useState(null);
  const handleFileChange = (e, carId) => {
  const file = e.target.files[0];
  setSelectedFiles((prev) => ({ ...prev, [carId]: file }));
};
// 
const handleUpload = async (carId) => {
  const file = selectedFiles[carId];
  if (!file) return alert('Veuillez sélectionner un fichier');

  const formData = new FormData();
  formData.append('image', file);

  try {
    await api.post(`/cars/${carId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert('Image uploadée !');

    fetchCars();           // refresh liste
    setSelectedFiles((prev) => ({ ...prev, [carId]: null })); // reset input
  } catch (error) {
    console.error(error);
    alert('Erreur lors de l’upload');
  }
};
//

 const fetchCars = async () => {
  try {
    const res = await api.get('/cars/my');

    console.log('API response:', res.data); // debug temporaire

    setCars(res.data.cars); // ✅ OBLIGATOIRE
  } catch (err) {
    setError('Impossible de charger les voitures');
  }
};


  useEffect(() => {
    fetchCars();
  }, []);
   // reset
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
     resetForm(); 

    fetchCars(); // refresh la liste
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
// supp image
const handleDeleteImage = async (carId, imageId) => {
  const confirmDelete = window.confirm('Supprimer cette image ?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/cars/${carId}/images/${imageId}`);

    alert('Image supprimée');
    fetchCars(); // refresh
  } catch (error) {
    console.error(error);
    alert('Erreur lors de la suppression');
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
        <button type="submit">
        {editingCarId ? 'Mettre à jour' : 'Ajouter'}
        </button>
          {editingCarId && (
        <button type="button" onClick={resetForm}>
        Annuler
        </button>
         )}
      </form>

      <h3>Mes voitures</h3>

      {Array.isArray(cars) && cars.length === 0 ? (
        <p>Aucune voiture</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car._id}>
              <p>
            {car.brand} {car.model} – {car.year} – {car.price} €
            </p>
              {Array.isArray(car.images) && car.images.length > 0 && (
             <div style={{ display: 'flex', gap: '10px' }}>
               {car.images.map((img) => (
                <div key={img._id} style={{ textAlign: 'center' }}>
                    <img
                        src={img.url}
                    alt={`${car.brand} ${car.model}`}
                    width="120"
                    />
                    <button
                    onClick={() => handleDeleteImage(car._id, img._id)}
                    style={{ display: 'block', marginTop: '4px', color: 'red' }}
                    >
                    Supprimer
                    </button>
                </div>
              ))}
            </div>
              )}
              {editingCarId === null && (
                <div style={{ marginTop: '5px' }}>
                    <input
                    type="file"
                    onChange={(e) => handleFileChange(e, car._id)}
                    />
                    <button onClick={() => handleUpload(car._id)}>Upload</button>
                </div>
                )}
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
