import React from "react";

export default function Note({ note, index }) {
  return (
    <div>
      {note.tittle && <h3>{note.tittle} </h3>}
      <ul>
        {note.text && <li key={"${index} - Text"}>{note.text}</li>}

        {note.image && (
          <li key={"${index} - Image"}>
            <img src={note.content} alt="Note" />{" "}
          </li>
        )}

        {note.file && (
          <li key={"${index} - Document"}>
            <a href={note.content} target="_blank" rel="noopener noreferrer">
              {note.file}
            </a>{" "}
          </li>
        )}
      </ul>
    </div>
  );
}
