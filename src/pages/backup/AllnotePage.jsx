import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Note from "../components/Note";

// import css styles
import "./SubSubCategoryPage.css";

export default function AllnotePage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubSubCategories] = useState([]);
  const [notes, setNotes] = useState([]);

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

  const getParentInfo = (note) => {
    // console.log(note);

    const subsubCategory = subsubCategories.find(
      (subsubCategory) => subsubCategory.id === note.subsubcategory_id
    );
    const subCategory = subCategories.find(
      (subCategory) => subCategory.id === note.subcategory_id
    );
    const category = categories.find(
      (category) => category.id === note.category_id
    );

    // console.log("category = ", category);
    // console.log("subCategory = ", subCategory);
    // console.log("subsubCategory = ", subsubCategory);
    const result = {
      category: category.name,
      subCategory: subCategory.name,
      subsubCategory: subsubCategory.name,
      categoryId: note.category_id,
      subCategoryId: note.subcategory_id,
      subsubCategoryId: note.subsubcategory_id,
    };
    // console.log("result = ", result);
    return result;
  };

  // fetch notes from the server
  useEffect(() => {
    axios
      .get("http://localhost:3000/notes")
      .then((response) => {
        const decodedNotes = response.data.map((note) => {
          const decodedFiles = note.files.map((file) => {
            const { base64, filename } = file;
            return convertBase64ToFile(base64, filename);
          });
          return { ...note, files: decodedFiles };
        });
        setNotes(decodedNotes);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:3000/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:3000/subcategories")
      .then((response) => {
        setSubCategories(response.data);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:3000/subsubcategories")
      .then((response) => {
        setSubSubCategories(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="subsubcategory-page-container">
        {notes.map((note) => (
          <Note key={note.id} note={note} parentInfo={getParentInfo(note)} />
        ))}
      </div>
    </div>
  );
}
