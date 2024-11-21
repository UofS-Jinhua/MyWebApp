import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Note from "./Note";
import "./SubsubCategory.css";

export default function SubCategory() {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");

  const handleSaveNote = () => {
    // 处理保存逻辑
    console.log("保存笔记:", newNote);
    setNewNote("");
  };

  // This is a dummy data structure to represent notes
  const notes = {
    "Job Related": {
      Veeva: [
        {
          tittle: "tittle 1",
          text: "Note 1",

          image: [
            "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],

          file: "Note 3",
        },
      ],
    },
  };

  const subCategoryNotes = notes[category]?.[subCategory] || [];

  return (
    <div className="subcategory-container">
      <button className="home-button" onClick={() => navigate("/")}>
        Home
      </button>
      <h2 className="subcategory-title">
        {subCategory} in {category}
      </h2>
      {console.log(subCategoryNotes)}
      <div className="notes-container">
        {subCategoryNotes.map((note, index) => (
          <div className="note-item" key={index}>
            {/* {console.log(note)}; */}
            <Note note={note} index={index} />
          </div>
        ))}
      </div>

      <div className="new-note-container">
        <textarea
          className="new-note-textarea"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="输入新的笔记内容"
          rows="5"
        />
        <button className="save-button" onClick={handleSaveNote}>
          保存笔记
        </button>
      </div>
    </div>
  );
}
