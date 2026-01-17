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
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Marque"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        required
      />
      <input
        placeholder="Modèle"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Année"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <button type="submit">
        {editingCarId ? 'Mettre à jour' : 'Ajouter'}
      </button>

      {editingCarId && (
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      )}
    </form>
  );
};

export default CarForm;
