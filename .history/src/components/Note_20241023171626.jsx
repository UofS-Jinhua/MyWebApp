import React from "react";

export default function Note({ note, index }) {
  return (
    <li key={index}>
      {note.type === "text" && <p>{note.content}</p>}
      {note.type === "image" && <img src={note.content} alt="Note" />}
      {note.type === "file" && (
        <a href={note.content} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )}
    </li>
  );
}
