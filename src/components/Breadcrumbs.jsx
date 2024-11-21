import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs() {
  const { category, subCategory, subsubCategory } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");
  const subsubCategoryId = queryParams.get("subsub_id");

  return (
    <div className="breadcrumbs">
      <Link to="/">Category</Link>
      {category && (
        <>
          {" > "}
          <Link to={`/${category}?id=${categoryId}`}>{category}</Link>
        </>
      )}
      {subCategory && (
        <>
          {" > "}
          <Link
            to={`/${category}/${subCategory}?id=${categoryId}&sub_id=${subCategoryId}`}
          >
            {subCategory}
          </Link>
        </>
      )}
      {subsubCategory && (
        <>
          {" > "}
          <Link to={`/${category}/${subCategory}/${subsubCategory}`}>
            {subsubCategory}
          </Link>
        </>
      )}
    </div>
  );
}
