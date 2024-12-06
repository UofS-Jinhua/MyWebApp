import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Note from "../components/Note";

// import css styles
import "./SubSubCategoryPage.css";

export default function SelectNote() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("query");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubSubCategories] = useState([]);
  const [myNotes, setMyNotes] = useState([]);

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

  const getParentInfo = (note) => {
    const subsubCategory = subsubCategories.find(
      (subsubCategory) => subsubCategory.id === note.subsubcategory_id
    );
    const subCategory = subCategories.find(
      (subCategory) => subCategory.id === note.subcategory_id
    );
    const category = categories.find(
      (category) => category.id === note.category_id
    );

    const result = {
      category: category.name,
      subCategory: subCategory.name,
      subsubCategory: subsubCategory.name,
      categoryId: note.category_id,
      subCategoryId: note.subcategory_id,
      subsubCategoryId: note.subsubcategory_id,
    };
    return result;
  };

  useEffect(() => {
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
      .get(`http://localhost:3000/notes/search/${keyword}`)
      .then((response) => {
        const decodedNotes = response.data.map((note) => {
          const decodedFiles = note.files.map((file) => {
            const { base64, filename } = file;
            return convertBase64ToFile(base64, filename);
          });
          return { ...note, files: decodedFiles };
        });
        setMyNotes(decodedNotes);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:3000/subsubcategories")
      .then((response) => {
        setSubSubCategories(response.data);
      })
      .catch((error) => console.log(error));
  }, [keyword]);

  return (
    <div>
      <Navbar />

      <div className="subsubcategory-page-container">
        {myNotes.map((note) => {
          // console.log(note.images);
          return (
            <Note key={note.id} note={note} parentInfo={getParentInfo(note)} />
          );
        })}
      </div>
    </div>
  );
}
