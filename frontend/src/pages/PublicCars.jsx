import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';


const PublicCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filtres
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // 🔃 Tri
  const [sort, setSort] = useState('');

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;
  // 
  const navigate = useNavigate();


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
      setCurrentPage(1); // reset pagination après filtrage
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // 🔃 Tri local
  const sortedCars = [...cars].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'year-desc') return b.year - a.year;
    if (sort === 'year-asc') return a.year - b.year;
    return 0;
  });

  // 📄 Pagination calcul
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Voitures disponibles</h1>

      <p>
        {cars.length === 0
          ? 'Aucune voiture trouvée'
          : `${cars.length} voiture(s) trouvée(s)`}
      </p>

      {/* 🔎 Filtres */}
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

      {/* 🔃 Tri */}
      <div style={{ marginBottom: '20px' }}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">-- Trier par --</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="year-desc">Année récente</option>
          <option value="year-asc">Année ancienne</option>
        </select>
      </div>

      {/* 🧾 Liste */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {currentCars.map((car) => (
          <div
            key={car._id}
            onClick={() => navigate(`/cars/${car._id}`)}
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              width: '220px',
              cursor: 'pointer',
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

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              disabled={currentPage === i + 1}
              style={{ marginRight: '5px' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicCars;
