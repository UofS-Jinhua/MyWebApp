import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useLocation,
  Link,
} from "react-router-dom";

// import components
import Breadcrumbs from "../components/Breadcrumbs";

// import css styles
import "../App.css";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");

  const [subcategories, setSubcategories] = useState([]);

  // console.log(category);
  // console.log(categoryId);
  // console.log(location);

  function addContent() {
    const new_content = prompt("Enter new SubCategory:");
    if (new_content !== null && new_content.trim() !== "") {
      // create a new SubCategory object
      const newSubCategory = {
        id: categoryId,
        name: new_content.trim(),
      };

      console.log(newSubCategory);

      // send a POST request to the server
      axios
        .post("http://localhost:3000/subcategories", newSubCategory)
        .then((response) => {
          // when successfully added a new SubCategory, update the contents list
          axios
            .get(`http://localhost:3000/subcategories/${categoryId}`)
            .then((res) => {
              setSubcategories(res.data);
            })
            .catch((err) => console.error(err));
        })
        .catch((error) => {
          console.error("An error occured when adding new subcate: ", error);
        });
    }
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3000/subcategories/${categoryId}`)
      .then((res) => {
        setSubcategories(res.data);
      })
      .catch((err) => console.error(err));
  });

  // main body of the component -------------------------------------------------
  return (
    <div>
      <div className="categories-directory">
        <Breadcrumbs />
        <button className="add-category-button" onClick={addContent}>
          New SubCategory
        </button>
      </div>

      <div className="category-page-container">
        <ul>
          {subcategories.map((subcat) => (
            <li key={subcat.id}>
              <Link
                to={`/${category}/${subcat.name}?id=${categoryId}&sub_id=${subcat.id}`}
              >
                {subcat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
