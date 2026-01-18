import React from 'react';
import styles from './CarList.module.css';

const CarList = ({
  cars,
  editingCarId,
  onEdit,
  onDelete,
  onUpload,
  onFileChange,
  onDeleteImage
}) => {
  if (!Array.isArray(cars) || cars.length === 0) {
    return <p>Aucune voiture..</p>;
  }

  return (
    <div className={styles.list}>
      {cars.map((car) => (
        <div key={car._id} className={styles.carCard}>
          <p>
            {car.brand} {car.model} – {car.year} – {car.price} €
          </p>

          {Array.isArray(car.images) && car.images.length > 0 && (
            <div className={styles.carImages}>
              {car.images.map((img) => (
                <div key={img._id} className={styles.carImageContainer}>
                  <img
                    src={img.url}
                    alt={`${car.brand} ${car.model}`}
                    className={styles.carImage}
                  />
                  <button
                    className={styles.danger}
                    onClick={() => onDeleteImage(car._id, img._id)}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}

          {editingCarId === null && (
            <div className={styles.uploadSection}>
              <input
                type="file"
                onChange={(e) => onFileChange(e, car._id)}
              />
              <button className={styles.primary} onClick={() => onUpload(car._id)}>Upload</button>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.primary} onClick={() => onEdit(car)}>Modifier</button>
            <button className={styles.danger} onClick={() => onDelete(car._id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarList;
