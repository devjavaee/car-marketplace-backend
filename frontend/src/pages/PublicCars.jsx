import { useEffect, useState } from 'react';
import api from '../api/axios';

const PublicCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filtres
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchCars = async () => {
    setLoading(true);

    try {
      const params = {};

      if (brand) params.brand = brand;
      if (year) params.year = year;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/cars', { params });
      setCars(res.data.cars);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Voitures disponibles</h1>

      {/* 🔎 Formulaire de filtres */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchCars();
        }}
        style={{ marginBottom: '20px' }}
      >
        <input
          placeholder="Marque"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          placeholder="Année"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          placeholder="Prix min"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          placeholder="Prix max"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="submit">Filtrer</button>
      </form>

      {cars.length === 0 && <p>Aucune voiture</p>}

     <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
  {cars.map((car) => (
    <div
      key={car._id}
      style={{
        border: '1px solid #ccc',
        padding: '16px',
        width: '220px',
      }}
    >
      <h3>
        {car.brand} {car.model}
      </h3>
      <p>Année : {car.year}</p>
      <p>Prix : {car.price} €</p>
    </div>
  ))}
</div>

    </div>
  );
};

export default PublicCars;
