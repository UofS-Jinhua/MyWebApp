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
  const [sortOption, setSortOption] = useState("oldest");

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

    axios
      .get(`${config.apiBaseUrl}/notes_without_contents`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const sortingnote = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedNotes = [...notes];

    if (option === "newest") {
      sortedNotes.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (option === "oldest") {
      sortedNotes.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (option === "a-z") {
      sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
    }
    setNotes(sortedNotes);
  };

  return (
    <div>
      <Navbar />

      <div className="categories-directory">
        {/* <Breadcrumbs /> */}
        <select className="sort-selection" onClick={sortingnote}>
          <option value="oldest">Oldest</option>
          <option value="newest">Newest</option>
          <option value="a-z">A-Z</option>
        </select>
      </div>

      {notes.length > 0 &&
        categories.length > 0 &&
        subCategories.length > 0 &&
        subsubCategories.length > 0 && (
          <div className="subsubcategory-page-container">
            {notes.map((note) => (
              <SimpleNote
                key={note.id}
                noteInfo={note}
                parentInfo={getParentInfo(note)}
              />
            ))}
          </div>
        )}
    </div>
  );
}
