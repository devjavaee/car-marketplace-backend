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