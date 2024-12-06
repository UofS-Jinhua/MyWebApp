import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Note from "../components/Note";

// import css styles
import "./SubSubCategoryPage.css";

export default function NotePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { category, subCategory, subsubCategory, noteName } = useParams();
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");
  const subsubCategoryId = queryParams.get("subsub_id");
  const noteId = queryParams.get("note_id");

  const [note, setNote] = useState([]);

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

  // fetch notes from the server
  useEffect(() => {
    axios
      .get(`http://localhost:3000/note/${noteId}`)
      .then((response) => {
        const decodedNotes = response.data.map((note) => {
          const decodedFiles = note.files.map((file) => {
            const { base64, filename } = file;
            return convertBase64ToFile(base64, filename);
          });
          return { ...note, files: decodedFiles };
        });
        setNote(decodedNotes);
        // console.log(note);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="subsubcategory-page-container">
        {note.map((note) => (
          <Note
            key={note.id}
            note={note}
            parentInfo={{
              category: category,
              subCategory: subCategory,
              subsubCategory: subsubCategory,
              categoryId: categoryId,
              subCategoryId: subCategoryId,
              subsubCategoryId: subsubCategoryId,
            }}
          />
        ))}
      </div>
    </div>
  );
}
