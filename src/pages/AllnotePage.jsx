import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import SimpleNote from "../components/SimpleNote";
import config from "../config";

// import css styles
import "./SubSubCategoryPage.css";

export default function AllnotePage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubSubCategories] = useState([]);
  const [notes, setNotes] = useState([]);

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

  // fetch notes from the server
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/notes_without_contents`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${config.apiBaseUrl}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${config.apiBaseUrl}/subcategories`)
      .then((response) => {
        setSubCategories(response.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${config.apiBaseUrl}/subsubcategories`)
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
          <SimpleNote
            key={note.id}
            noteInfo={note}
            parentInfo={getParentInfo(note)}
          />
        ))}
      </div>
    </div>
  );
}
