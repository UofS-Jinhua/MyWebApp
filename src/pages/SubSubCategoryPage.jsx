import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Note from "../components/Note";

// import css styles
import "./SubSubCategoryPage.css";

export default function SubSubCategoryPage() {
  const { category, subCategory, subsubCategory } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");
  const subsubCategoryId = queryParams.get("subsub_id");
  const [myNotes, setMyNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

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

  //   // Decode base64 to file
  const convertBase64ToFile = (base64, filename) => {
    const mimeType = base64.match(/data:(.*?);base64,/)[1];
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeType });
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

  const handleDeleteImage = (index) => {
    const new_Images = newImages.filter((_, i) => i !== index);
    setNewImages(new_Images);
  };

  const handleDeleteFile = (index) => {
    const new_Files = newFiles.filter((_, i) => i !== index);
    setNewFiles(new_Files);
  };

  // add a new Note to the subsubCategory
  async function handleSaveNote() {
    if (
      newNote.trim() === "" &&
      newImages.length === 0 &&
      newFiles.length === 0
    ) {
      alert("Please enter note content or upload images/files.");
      return;
    }

    const imagesBase64 = await Promise.all(newImages.map(convertFileToBase64));
    const filesBase64 = await Promise.all(newFiles.map(convertFileToBase64));

    var new_title = prompt("Enter Note Title:");
    if (new_title.trim() === "" || new_title === null) {
      alert("Please enter note title.");
      return;
    }

    const noteData = {
      title: new_title,
      content: newNote,
      images: imagesBase64,
      files: filesBase64,
      subsubcategory_id: subsubCategoryId,
      subcategory_id: subCategoryId,
      category_id: categoryId,
    };

    console.log(noteData);

    axios
      .post("http://localhost:3000/notes", noteData)
      .then((response) => {
        // if success, fetch notes from the server
        axios
          .get(`http://localhost:3000/notes/${subsubCategoryId}`)
          .then((res) => {
            const notesWithFiles = res.data.map((note) => ({
              ...note,
              files: note.files.map((file) => {
                const { base64, filename } = file;
                return convertBase64ToFile(base64, filename);
              }),
            }));
            setMyNotes(notesWithFiles);
            setNewNote("");
            setNewImages([]);
            setNewFiles([]);
          })
          .catch((err) => console.error(err));
      })
      .catch((error) => {
        console.error("Got error when post note to server：", error);
      });
  }

  // fetch notes from the server
  useEffect(() => {
    if (subsubCategoryId) {
      axios
        .get(`http://localhost:3000/notes/${subsubCategoryId}`)
        .then((res) => {
          // console.log(res.data);
          const notesWithFiles = res.data.map((note) => ({
            ...note,
            files: note.files.map((file) => {
              const { base64, filename } = file;
              return convertBase64ToFile(base64, filename);
            }),
          }));
          // console.log(notesWithFiles);
          setMyNotes(notesWithFiles);
        })
        .catch((err) => console.error(err));
    }
  }, [subsubCategoryId]);

  return (
    <div>
      <Navbar />

      <div className="subsubcategory-page-container">
        {myNotes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>

      <div className="new-note-container">
        {/* user input content: text ------------------------ */}
        <textarea
          className="new-note-textarea"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Contents of the new note..."
          rows="5"
        />

        <div className="file-input-container">
          {/* upload images ---------------------------------- */}
          <div className="file-input-box">
            <h2>Upload Images</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewImages(Array.from(e.target.files))}
            />
            {newImages.length > 0 && (
              <div className="file-preview">
                {newImages.map((image, index) => (
                  <div key={index} className="file-preview-item">
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="file-preview-image"
                    />
                    <span className="file-preview-name">
                      {splitFileName(image.name)}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* upload files ---------------------------------- */}
          <div className="file-input-box">
            <h2>Upload Files</h2>
            <input
              type="file"
              multiple
              onChange={(e) => setNewFiles(Array.from(e.target.files))}
            />
            {newFiles.length > 0 && (
              <div className="file-preview">
                <ul>
                  {newFiles.map((file, index) => (
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
                        className="delete-button"
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
        <button className="save-button" onClick={handleSaveNote}>
          Upload
        </button>
      </div>
    </div>
  );
}
