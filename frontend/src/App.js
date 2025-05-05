// App.js
import React, { useState } from 'react';
import Header from './Header';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput.files[0]) {
      alert('Please upload an image first.');
      setLoading(false);
      return;
    }
    formData.append('image', fileInput.files[0]);

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-caption', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setCaption(data.caption);
    } catch (error) {
      console.error('Error fetching caption:', error);
      setCaption('Failed to generate caption.');
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-container">
        <h2>Upload an Image for Captioning</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-file"
          />
          <button type="submit" className="generate-button">
            Generate Caption
          </button>
        </form>

        {loading && <p>Loading...</p>}

        {caption && (
          <div className="caption-container">
            <h3>Generated Caption:</h3>
            <p>{caption}</p>
            {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Image Captioning App</p>
      </footer>
    </div>
  );
};

export default App;
