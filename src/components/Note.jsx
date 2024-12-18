import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Breadcrumbs from "./Breadcrumbs";
import config from "../config";

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

  const handleSaveNote = async () => {
    const base64Files = await Promise.all(
      updatedNote.files.map((file) => convertFileToBase64(file))
    );
    const updatedNoteWithBase64Files = {
      ...updatedNote,
      files: base64Files,
    };

    // console.log("Updated Note with base64 files:", updatedNoteWithBase64Files);
    axios
      .put(`${config.apiBaseUrl}/notes/${note.id}`, updatedNoteWithBase64Files)
      .then((response) => {
        // console.log("Note updated:", response.data);
        setShowModal(false);
        note.title = updatedNote.title;
        note.content = updatedNote.content;
        note.images = updatedNote.images;
        note.files = updatedNote.files;
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
  };

  const handleDeleteClick = () => {
    axios
      .delete(`${config.apiBaseUrl}/notes/${note.id}`)
      .then((response) => {
        // console.log("Note deleted:", response.data);
        setShowModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };
  // Encode file to base64
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

  const splitFileName = (filename) => {
    const index = filename.lastIndexOf(".");
    const extension = filename.slice(index);
    const name = filename.slice(0, index);

    if (name.length > 10) {
      return (
        name.slice(0, 10) + "..." + name.slice(index - 5, index) + extension
      );
    }
    return filename;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(convertFileToBase64));
    setUpdatedNote({
      ...updatedNote,
      images: [...updatedNote.images, ...base64Images],
    });
  };

  const handleDeleteImage = (index) => {
    const newImages = updatedNote.images.filter((_, i) => i !== index);
    setUpdatedNote({
      ...updatedNote,
      images: newImages,
    });
  };

  const handleFileChange = (e) => {
    const newfiles = Array.from(e.target.files);

    setUpdatedNote({
      ...updatedNote,
      files: [...updatedNote.files, ...newfiles],
    });
  };

  const handleDeleteFile = (index) => {
    const newFiles = updatedNote.files.filter((_, i) => i !== index);
    setUpdatedNote({
      ...updatedNote,
      files: newFiles,
    });
  };

  const renderers = {
    img: ({ alt, src, title }) => {
      // image
      const decodedSrc = decodeURIComponent(src);
      const image = note.images.find((image) => image.filename === decodedSrc);
      const imageUrl = image ? `${image.base64}` : src;
      return <img src={imageUrl} alt={alt} title={title} />;
    },
    a: ({ href, children }) => {
      // YouTube link
      const youtubeMatch = href.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return (
          <div className="youtube-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      // Bilibili link
      const bilibiliMatch = href.match(
        /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/([a-zA-Z0-9_-]+)/
      );
      if (bilibiliMatch) {
        const videoId = bilibiliMatch[1];
        return (
          <div className="bilibili-video">
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=0`}
              title="Bilibili video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      // file
      const decodedhref = decodeURIComponent(href);
      const file = note.files.find((file) => file.name === decodedhref);
      const fileUrl = file ? URL.createObjectURL(file) : href;
      return (
        <a href={fileUrl} download={file ? file.name : undefined}>
          {children}
        </a>
      );
    },
  };

  return (
    <div className="note-container">
      <div className="note-header">
        {note.title && (
          <h3>
            <Link
              to={`/${parentInfo.category}/${parentInfo.subCategory}/${parentInfo.subsubCategory}/${note.title}?id=${parentInfo.categoryId}&sub_id=${parentInfo.subCategoryId}&subsub_id=${parentInfo.subsubCategoryId}&note_id=${note.id}`}
            >
              {note.title}
            </Link>
          </h3>
        )}

        <button className="modify-button" onClick={handleModifyClick}>
          Modify
        </button>
      </div>
      {note.content && (
        // <p className="note-content">{note.content}</p>
        <div>
          <hr />
          <div className="note-content">
            {/* {console.log(note.images, note.files)} */}
            <ReactMarkdown components={renderers} remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
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
          <div className="file-grid">
            {note.files.map((file, index) => {
              const fileURL = URL.createObjectURL(file);
              return (
                <div key={index} className="file-item">
                  <a
                    key={index}
                    href={fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    {splitFileName(file.name)}
                  </a>
                </div>
              );
            })}
          </div>
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
            {/* user input Title and Content: text ------------------------ */}
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
              {/* update images ---------------------------------- */}
              <div className="file-input-box">
                <h2>Images</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {updatedNote.images.length > 0 && (
                  <div className="file-preview">
                    {updatedNote.images.map((image, index) => (
                      <div key={index} className="file-preview-item">
                        <img
                          key={index}
                          src={image.base64}
                          alt="Preview"
                          className="file-preview-image"
                        />
                        <span className="file-preview-name">
                          {splitFileName(image.filename)}
                        </span>
                        <button
                          className="delete-button-x"
                          onClick={() => handleDeleteImage(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* update files ---------------------------------- */}
              <div className="file-input-box">
                <h2>Files</h2>
                <input type="file" multiple onChange={handleFileChange} />
                {updatedNote.files.length > 0 && (
                  <div className="file-preview">
                    <ul>
                      {updatedNote.files.map((file, index) => (
                        <li key={index}>
                          <a
                            key={index}
                            href={URL.createObjectURL(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            {splitFileName(file.name)}{" "}
                          </a>
                          <button
                            className="delete-button-x"
                            onClick={() => handleDeleteFile(index)}
                          >
                            X
                          </button>
                        </li>
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
                onClick={() => {
                  setShowModal(false);
                  setUpdatedNote(note);
                }}
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
