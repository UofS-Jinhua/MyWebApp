import React, { useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "./Breadcrumbs";

import "./Note.css";
import "./SimpleNote.css";

export default function SimpleNote({ noteInfo, parentInfo }) {
  const [note, setNote] = useState(noteInfo);

  return (
    <div className="note-container">
      <div className="note-header">
        {note.title && (
          <h3>
            <Link
              to={`/${parentInfo.category}/${parentInfo.subCategory}/${parentInfo.subsubCategory}/${note.title}?id=${parentInfo.categoryId}&sub_id=${parentInfo.subCategoryId}&subsub_id=${parentInfo.subsubCategoryId}&note_id=${note.id}`}
            >
              {note.title}
            </Link>
          </h3>
        )}
        <div className="note-info">
          {note.contain_text == 1 && (
            <span className="note-info-text">Text</span>
          )}
          {note.contain_file == 1 && (
            <span className="note-info-files">Files</span>
          )}
          {note.contain_image == 1 && (
            <span className="note-info-images">Images</span>
          )}
        </div>
      </div>

      <div className="note-footer">
        <div className="note-breadcrumbs">
          <Breadcrumbs breadcrumbsData={parentInfo} />
        </div>
        <div className="note-creation-time">
          <p>Created: {new Date(note.created_at).toLocaleString()}</p>
          <p>
            Last Modified: {new Date(note.last_modify_date).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
