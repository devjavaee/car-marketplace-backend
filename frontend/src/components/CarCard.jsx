const CarCard = ({
  car,
  isEditing,
  onEdit,
  onDelete,
  onUpload,
  onFileChange,
  onDeleteImage,
}) => {
  return (
    <div className="car-card">
      <h4>{car.brand} {car.model}</h4>
      <p>{car.year} • {car.price} €</p>

      {Array.isArray(car.images) && car.images.length > 0 && (
        <div className="car-images">
          {car.images.map((img) => (
            <div key={img._id}>
              <img src={img.url} alt={car.brand} />
              <button onClick={() => onDeleteImage(car._id, img._id)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {!isEditing && (
        <div>
          <input type="file" onChange={(e) => onFileChange(e, car._id)} />
          <button onClick={() => onUpload(car._id)}>Upload</button>
        </div>
      )}

      <div className="actions">
        <button onClick={() => onEdit(car)}>Modifier</button>
        <button onClick={() => onDelete(car._id)}>Supprimer</button>
      </div>
    </div>
  );
};

export default CarCard;
