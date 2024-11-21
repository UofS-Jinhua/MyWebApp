import React, { useState } from "react";
import "./Note.css";

export default function Note({ note, index }) {
  const [clickedImage, setClickedImage] = useState(null);

  const handleClick = (image) => {
    setClickedImage(image);
  };

  const handleBackToGrid = () => {
    setClickedImage(null);
  };

  return (
    <div className="note-container">
      {note.tittle && <h3>{note.tittle}</h3>}
      <hr />

      {note.text && <p>{note.text}</p>}
      {note.image && (
        <div className="ImgBox">
          {clickedImage ? (
            <div className="expanded-view">
              <img
                src={clickedImage}
                alt="Zoomed In"
                className="zoomed-image"
                onClick={handleBackToGrid}
              />
              <div className="row-view">
                {note.image.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                    onClick={() => handleClick(image)}
                  />
                ))}
              </div>
              {/* <button onClick={handleBackToGrid}>Back to Grid</button> */}
            </div>
          ) : (
            <div className="grid-view">
              {note.image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="grid-image"
                  onClick={() => handleClick(image)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {note.file && (
        <div>
          <br />
          <br />

          <a href={note.file} target="_blank" rel="noopener noreferrer">
            {note.file}
          </a>
        </div>
      )}
    </div>
  );
}
