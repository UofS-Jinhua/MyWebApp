import { useState } from "react";
import "./App.css";

function App() {
  const categories = {
    JobRelated: [],
    Daily: [],
    Technical: [],
  };

  const [notes, setNotes] = useState(categories);

  function addNote({ category }, { subCategory }, { note }) {
    const newNotes = { ...notes };
    newNotes[category][subCategory].push(note);
    setNotes(newNotes);
  }

  return (
    <div>
      <h1>笔记应用</h1>
      {Object.keys(notes).map((category) => (
        <Category
          key={category}
          category={category}
          subCategories={notes[category]}
          addNote={addNote}
        />
      ))}
    </div>
  );

  return <></>;
}

export default App;
