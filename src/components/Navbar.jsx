import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// import components
import Breadcrumbs from "./Breadcrumbs";

// import css styles
import "./Navbar.css";

export default function Navbar() {
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Breadcrumbs />
      </div>
      <div className="navbar-right">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
        <div
          className="file-system"
          onMouseEnter={() => setShowNotes(true)}
          onMouseLeave={() => setShowNotes(false)}
        >
          <h3>My Notes</h3>{" "}
          {showNotes && (
            <div className="notes-dropdown">
              <ul>
                <li>
                  <Link to="/">All Categories</Link>
                </li>
                {/* <li>
                  <Link to="/all-subcategories">All SubCategories</Link>
                </li>
                <li>
                  <Link to="/all-subsubcategories">All SubSubCategories</Link>
                </li> */}
                <li>
                  <Link to="/all-notes">All Notes</Link>
                </li>
              </ul>
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
