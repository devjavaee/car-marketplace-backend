const CarList = ({ cars, editingCarId, onEdit, onDelete, onUpload, onFileChange, onDeleteImage }) => {
  if (!Array.isArray(cars) || cars.length === 0) return <p>Aucune voiture</p>;

  return (
    <div className="car-grid">
      {cars.map((car) => (
        <div key={car._id} className="car-card">
          <p>{car.brand} {car.model} – {car.year} – {car.price} €</p>

          {Array.isArray(car.images) && car.images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {car.images.map((img) => (
                <div key={img._id}>
                  <img src={img.url} alt={`${car.brand} ${car.model}`} width="120" />
                  <button onClick={() => onDeleteImage(car._id, img._id)} style={{ color: 'red' }}>Supprimer</button>
                </div>
              ))}
            </div>
          )}

          {editingCarId === null && (
            <div>
              <input type="file" onChange={(e) => onFileChange(e, car._id)} />
              <button onClick={() => onUpload(car._id)}>Upload</button>
            </div>
          )}

          <button className="primary" onClick={() => onEdit(car)}>Modifier</button>
          <button className="danger" onClick={() => onDelete(car._id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
};

export default CarList;
