import React, { useState } from "react";
import axios from "axios";
import Breadcrumbs from "./Breadcrumbs";

import "./Note.css";

export default function Note({ note, parentInfo }) {
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedNote, setUpdatedNote] = useState(note);

  const handleClick = (image) => {
    setClickedImage(image);
  };

  const handleBackToGrid = () => {
    setClickedImage(null);
  };

  const handleModifyClick = () => {
    setShowModal(true);
  };

  const handleSaveNote = () => {
    axios
      .put(`http://localhost:3000/notes/${note.id}`, updatedNote)
      .then((response) => {
        console.log("Note updated:", response.data);
        setShowModal(false);
        // 更新笔记数据
        note.title = updatedNote.title;
        note.content = updatedNote.content;
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
  };

  const handleDeleteClick = () => {
    axios
      .delete(`http://localhost:3000/notes/${note.id}`)
      .then((response) => {
        console.log("Note deleted:", response.data);
        setShowModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({ base64: reader.result, filename: file.name });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="note-container">
      <div className="note-header">
        {note.title && <h3>{note.title}</h3>}

        <button className="modify-button" onClick={handleModifyClick}>
          Modify
        </button>
      </div>
      {note.content && <p>{note.content}</p>}
      {note.images && note.images.length > 0 && (
        <div className="ImgBox">
          <hr />
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
                    src={image.base64}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                    onClick={() => handleClick(image.base64)}
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
                  src={image.base64}
                  alt={`Thumbnail ${index + 1}`}
                  className="grid-image"
                  onClick={() => handleClick(image.base64)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {note.files && note.files.length > 0 && (
        <div className="note-files">
          <hr />
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

      <div className="note-footer">
        <div className="note-breadcrumbs">
          <Breadcrumbs breadcrumbsData={parentInfo} />
        </div>
        <div className="note-creation-time">
          <p>Created: {new Date(note.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Updating Note ---------------------------------------------------------------------------------------- */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {/* user input content: text ------------------------ */}
            <label className="modal-content-title">
              Title:
              <input
                className="modal-content-title-input"
                type="text"
                value={updatedNote.title}
                onChange={(e) =>
                  setUpdatedNote({ ...updatedNote, title: e.target.value })
                }
              />
            </label>
            <textarea
              className="new-note-textarea"
              value={updatedNote.content}
              onChange={(e) =>
                setUpdatedNote({ ...updatedNote, content: e.target.value })
              }
              rows="7"
            />

            <div className="file-input-container">
              {/* upload images ---------------------------------- */}
              <div className="file-input-box">
                <h2>Images</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setUpdatedNote({
                      ...updatedNote,
                      images: Array.from(e.target.files),
                    })
                  }
                />
                {updatedNote.images.length > 0 && (
                  <div className="file-preview">
                    {updatedNote.images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image.base64)}
                        alt="Preview"
                        className="file-preview-image"
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* upload files ---------------------------------- */}
              <div className="file-input-box">
                <h2>Files</h2>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setUpdatedNote({
                      ...updatedNote,
                      files: Array.from(e.target.files),
                    })
                  }
                />
                {updatedNote.files.length > 0 && (
                  <div className="file-preview">
                    <ul>
                      {updatedNote.files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="button-container">
              <button className="update-button" onClick={handleSaveNote}>
                Update
              </button>
              <button className="delete-button" onClick={handleDeleteClick}>
                Delete
              </button>
              <button
                className="back-button"
                onClick={() => setShowModal(false)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
