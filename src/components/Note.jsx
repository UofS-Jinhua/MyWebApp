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
      {note.title && (
        <h3>
          {note.title} <hr />
        </h3>
      )}

      {note.content && (
        <p>
          {note.content} <hr />
        </p>
      )}
      {note.images && (
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
                {note.images.map((image, index) => (
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
              {note.images.map((image, index) => (
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
      {note.files && (
        // <div>
        //   <br />
        //   <br />

        //   <a href={note.files} target="_blank" rel="noopener noreferrer">
        //     {note.files}
        //   </a>
        // </div>
        <div className="note-files">
          {note.files.map((file, index) => {
            const fileURL = URL.createObjectURL(file);
            return (
              <a
                key={index}
                href={fileURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
