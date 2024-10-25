import { useParams, useNavigate } from "react-router-dom";
import Note from "./Note";

export default function SubCategory() {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();

  // This is a dummy data structure to represent notes
  const notes = {
    "Job Related": {
      Veeva: [
        { tittle: "tittle 1" },
        { text: "Note 1" },
        { image: "Note 2" },
        { file: "Note 3" },
      ],
    },
  };

  const subCategoryNotes = notes[category]?.[subCategory] || [];

  return (
    <div>
      <button onClick={() => navigate("/")}>Home</button>
      <h2>
        {subCategory} in {category}
      </h2>

      {subCategoryNotes.map((note, index) => (
        <Note note={note} index={index} />
      ))}
    </div>
  );
}
