import React, { useState } from 'react';
import './CarSearch.css'; // Importation du fichier CSS

const CarSearch = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCar, setSelectedCar] = useState(null); // Etat pour stocker la voiture sélectionnée

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:8080/api/cars?query=${query}`);
            const data = await response.json();
            setImages(data.results || []);
        } catch (err) {
            setError('Erreur de récupération des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCarClick = (car) => {
        setSelectedCar(car); // Définit la voiture sélectionnée et ouvre la modale
    };

    const handleCloseModal = () => {
        setSelectedCar(null); // Ferme la modale
    };

    return (
        <div className="car-search-container">
            <h1 className="title">Rechercher des voitures</h1>
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une voiture"
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Rechercher</button>
            </div>

            {loading && <p className="loading">Chargement...</p>}
            {error && <p className="error-message">{error}</p>}

            {images.length > 0 && (
                <div className="image-grid">
                    {images.map((image) => (
                        <div key={image.id} className="image-item">
                            <img
                                src={image.urls.small}
                                alt={image.alt_description}
                                className="car-image"
                                onClick={() => handleCarClick(image)} // Affiche les détails de la voiture quand l'image est cliquée
                            />
                        </div>
                    ))}
                </div>
            )}

            {selectedCar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={handleCloseModal}>X</button>
                        <h2>{selectedCar.name}</h2>
                        <img src={selectedCar.urls.full} alt={selectedCar.alt_description} className="car-modal-image" />
                        <p>{selectedCar.description || "Aucune description disponible."}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarSearch;
