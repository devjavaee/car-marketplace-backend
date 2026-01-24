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
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;


  const fetchCars = async () => {
    setLoading(true);
    setCurrentPage(1);
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
  // pagin
  const indexOfLastCar = currentPage * carsPerPage;
const indexOfFirstCar = indexOfLastCar - carsPerPage;
const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

const totalPages = Math.ceil(cars.length / carsPerPage);


  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Voitures disponibles</h1>
            <p>
        {cars.length === 0
          ? 'Aucune voiture trouvée'
          : `${cars.length} voiture(s) trouvée(s)`}
        </p>

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

        <button type="submit" disabled={loading}>
         {loading ? 'Recherche...' : 'Filtrer'}
        </button>

      </form>

      {cars.length === 0 && <p>Aucune voiture</p>}

     <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
  {currentCars.map((car) => (
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
 {/* Pagination */}
{totalPages > 1 && (
  <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      Précédent
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        style={{
          fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
        }}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Suivant
    </button>
  </div>
)}

    </div>
  );
};

export default PublicCars;
