import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ breadcrumbsData }) {
  var { category, subCategory, subsubCategory } = useParams();

  if (!category && breadcrumbsData) {
    category = breadcrumbsData.category;
  }
  if (!subCategory && breadcrumbsData) {
    subCategory = breadcrumbsData.subCategory;
  }
  if (!subsubCategory && breadcrumbsData) {
    subsubCategory = breadcrumbsData.subsubCategory;
  }

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  var categoryId = queryParams.get("id");
  var subCategoryId = queryParams.get("sub_id");
  var subsubCategoryId = queryParams.get("subsub_id");

  if (!categoryId && breadcrumbsData) {
    categoryId = breadcrumbsData.categoryId;
  }
  if (!subCategoryId && breadcrumbsData) {
    subCategoryId = breadcrumbsData.subCategoryId;
  }
  if (!subsubCategoryId && breadcrumbsData) {
    subsubCategoryId = breadcrumbsData.subsubCategoryId;
  }

  // console.log(
  //   category,
  //   subCategory,
  //   subsubCategory,
  //   categoryId,
  //   subCategoryId,
  //   subsubCategoryId
  // );

  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
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
          <Link
            to={`/${category}/${subCategory}/${subsubCategory}?id=${categoryId}&sub_id=${subCategoryId}&subsub_id=${subsubCategoryId}`}
          >
            {subsubCategory}
          </Link>
        </>
      )}
    </div>
  );
}
