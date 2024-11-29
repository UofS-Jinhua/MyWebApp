import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// import components
import Breadcrumbs from "./Breadcrumbs";

// import css styles
import "./Navbar.css";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/categories").then((response) => {
      setCategories(response.data);
    });
    axios.get("http://localhost:3000/subcategories").then((response) => {
      setSubcategories(response.data);
    });
    axios.get("http://localhost:3000/subsubcategories").then((response) => {
      setSubsubcategories(response.data);
    });
    axios.get("http://localhost:3000/notes").then((response) => {
      setNotes(response.data);
    });
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Breadcrumbs />
      </div>
      <div className="navbar-right">
        <div
          className="file-system"
          onMouseEnter={() => setShowNotes(true)}
          onMouseLeave={() => setShowNotes(false)}
        >
          <h3>My Notes</h3>
          {showNotes && (
            <div className="notes-dropdown">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-item"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link to={`/${category.name}?id=${category.id}`}>
                    {" "}
                    {category.name}
                  </Link>
                  {hoveredCategory === category.id && (
                    <div
                      className="subcategory-dropdown"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {subcategories
                        .filter((subcat) => subcat.category_id === category.id)
                        .map((subcat) => (
                          <div
                            key={subcat.id}
                            className="subcategory-item"
                            onMouseEnter={() =>
                              setHoveredSubcategory(subcat.id)
                            }
                            onMouseLeave={() => setHoveredSubcategory(null)}
                          >
                            <Link
                              to={`/${category.name}/${subcat.name}?id=${category.id}&sub_id=${subcat.id}`}
                            >
                              {subcat.name}
                            </Link>
                            {hoveredSubcategory === subcat.id && (
                              <div
                                className="subsubcategory-dropdown"
                                onMouseEnter={() =>
                                  setHoveredSubcategory(subcat.id)
                                }
                                onMouseLeave={() => setHoveredSubcategory(null)}
                              >
                                {subsubcategories
                                  .filter(
                                    (subsubcat) =>
                                      subsubcat.subcategory_id === subcat.id
                                  )
                                  .map((subsubcat) => (
                                    <div
                                      key={subsubcat.id}
                                      className="subsubcategory-item"
                                    >
                                      <Link
                                        to={`/${category.name}/${subcat.name}/${subsubcat.name}?id=${category.id}&sub_id=${subcat.id}&subsub_id=${subsubcat.id}`}
                                      >
                                        {subsubcat.name}
                                      </Link>
                                      <ul>
                                        {notes
                                          .filter(
                                            (note) =>
                                              note.subsubcategory_id ===
                                              subsubcat.id
                                          )
                                          .map((note) => (
                                            <li key={note.id}>
                                              <Link
                                                to={`/${category.name}/${subcat.name}/${subsubcat.name}/${note.title}`}
                                              >
                                                {note.title}
                                              </Link>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="login-info">
          <h3>Devices</h3>
        </div>
      </div>
    </div>
  );
}
