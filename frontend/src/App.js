import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [captionedImage, setCaptionedImage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:8000/generate-caption", formData);
      setCaption(res.data.caption);
      setCaptionedImage(res.data.captioned_image);
    } catch (err) {
      console.error(err);
      setCaption("Error generating caption.");
    }
  };

  return (
    <div className="App">
      <h1>Image Caption Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Generate Caption</button>
      </form>
      {caption && <p><strong>Caption:</strong> {caption}</p>}
      {captionedImage && <img src={captionedImage} alt="Captioned Result" style={{ maxWidth: "100%", marginTop: "20px" }} />}
    </div>
  );
}

export default App;
