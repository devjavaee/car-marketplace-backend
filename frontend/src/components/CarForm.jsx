import React from 'react';
import styles from './CarForm.module.css';

const CarForm = ({
  brand,
  model,
  year,
  price,
  editingCarId,
  setBrand,
  setModel,
  setYear,
  setPrice,
  onSubmit,
  onCancel
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.input}
        placeholder="Marque"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <input
        className={styles.input}
        placeholder="Modèle"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="number"
        placeholder="Année"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div className={styles.buttonGroup}>
        <button type="submit" className={`${styles.button} ${styles.primary}`}>
          {editingCarId ? 'Mettre à jour' : 'Ajouter'}
        </button>

        {editingCarId && (
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default CarForm;
