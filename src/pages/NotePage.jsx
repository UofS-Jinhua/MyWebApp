import axios from "axios";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Note from "../components/Note";
import config from "../config";

// import css styles
import "./SubSubCategoryPage.css";
import "./NotePage.css";

export default function NotePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { category, subCategory, subsubCategory, noteName } = useParams();
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");
  const subsubCategoryId = queryParams.get("subsub_id");
  const noteId = queryParams.get("note_id");

  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState("oldest");

  // store all the categories, subcategories, subsubcategories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subsubCategories, setSubSubCategories] = useState([]);

  // store the main note for this page
  const [note, setNote] = useState([]);

  // store the linked notes.
  // linkedNotes contains the ids of the linked notes (list)
  // linkedNotesContents contains the actual linked notes with their titles
  const [hasLinkedNotes, setHasLinkedNotes] = useState(false);
  const [linkedNotes, setLinkedNotes] = useState([]);
  const [linkedNotesContents, setLinkedNotesContents] = useState([]);
  // a temporary variable to store the updated linked notes
  const [updatedlinkedNotes, setUpdatedLinkedNotes] = useState([]);

  // store the selected subsubcategory and its notes
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);

  const [allNotes, setAllNotes] = useState([]);

  //   // Decode base64 to file
  const convertBase64ToFile = (base64, filename) => {
    const mimeType = base64.match(/data:(.*?);base64,/)[1];
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeType });
  };

  // fetch notes from the server
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/note/${noteId}`)
      .then((response) => {
        const decodedNotes = response.data.map((note) => {
          const decodedFiles = note.files.map((file) => {
            const { base64, filename } = file;
            return convertBase64ToFile(base64, filename);
          });
          return { ...note, files: decodedFiles };
        });
        setNote(decodedNotes);
        // console.log(note);
      })
      .catch((error) => console.log(error));

    axios.get(`${config.apiBaseUrl}/linkednotes/${noteId}`).then((response) => {
      const linkedNotes = response.data;
      if (linkedNotes.length > 0) {
        setHasLinkedNotes(true);
      }

      setLinkedNotes(linkedNotes[0].linked_note_id);
      setUpdatedLinkedNotes(linkedNotes[0].linked_note_id);
    });

    axios.get(`${config.apiBaseUrl}/categories`).then((response) => {
      setCategories(response.data);
    });
    axios.get(`${config.apiBaseUrl}/subcategories`).then((response) => {
      setSubCategories(response.data);
    });
    axios.get(`${config.apiBaseUrl}/subsubcategories`).then((response) => {
      setSubSubCategories(response.data);
    });
    axios
      .get(`${config.apiBaseUrl}/notes_without_contents`)
      .then((response) => {
        setAllNotes(response.data);
      });
  }, []);

  useEffect(() => {
    setLinkedNotesContents((prevContents) =>
      prevContents.filter((note) => linkedNotes.includes(note.id))
    );

    linkedNotes.forEach((note_id) => {
      axios
        .get(`${config.apiBaseUrl}/note/${note_id}`)
        .then((response) => {
          const decodedNotes = response.data.map((note) => {
            const decodedFiles = note.files.map((file) => {
              const { base64, filename } = file;
              return convertBase64ToFile(base64, filename);
            });
            return { ...note, files: decodedFiles };
          });
          setLinkedNotesContents((prev) => [...prev, decodedNotes]);
        })
        .catch((error) => console.log(error));
    });
  }, [linkedNotes]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUpdatedLinkedNotes(linkedNotes);
  };

  const removeLinkedNote = (noteId) => {
    setUpdatedLinkedNotes(updatedlinkedNotes.filter((id) => id !== noteId));
  };

  const addLinkedNote = (id) => {
    setUpdatedLinkedNotes((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    console.log(updatedlinkedNotes);
  };

  const saveLinkedNote = (e) => {
    setLinkedNotes(updatedlinkedNotes);

    if (!hasLinkedNotes) {
      axios
        .post(`${config.apiBaseUrl}/linkednotes`, {
          note_id: noteId,
          linked_note_id: updatedlinkedNotes,
        })
        .then((response) => {
          console.log("Linked notes saved:", response.data);
        })
        .catch((error) => console.log(error));
      setHasLinkedNotes(true);
    } else {
      axios.put(`${config.apiBaseUrl}/linkednotes/${noteId}`, {
        note_id: noteId,
        linked_note_id: updatedlinkedNotes,
      });
    }

    setShowModal(false);
  };

  const sortingnote = (e) => {
    const option = e.target.value;
    setSortOption(option);

    // console.log(linkedNotesContents);

    let flattenedNotes = linkedNotesContents.flat();
    let sortedNotes = [...flattenedNotes];

    if (option === "newest") {
      sortedNotes.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (option === "oldest") {
      sortedNotes.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (option === "a-z") {
      sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
    }

    let sortedLinkedNotes = [];
    sortedNotes.forEach((note) => {
      sortedLinkedNotes.push([note]);
    });
    setLinkedNotesContents(sortedLinkedNotes);
    // console.log(sortedLinkedNotes);
  };

  return (
    <div>
      <Navbar />

      <div className="categories-directory">
        <button className="add-category-button" onClick={openModal}>
          Link Notes
        </button>
      </div>

      <div className="subsubcategory-page-container">
        {note.map((note) => (
          <Note
            key={note.id}
            note={note}
            parentInfo={{
              category: category,
              subCategory: subCategory,
              subsubCategory: subsubCategory,
              categoryId: categoryId,
              subCategoryId: subCategoryId,
              subsubCategoryId: subsubCategoryId,
            }}
          />
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-header">Link Notes</h2>
        <div className="modal-section">
          <label htmlFor="subsubcategory">Select Subsubcategory:</label>
          <select
            id="subsubcategory"
            onChange={(e) => {
              const subsubCategoryId = parseInt(e.target.value);
              setSelectedSubSubCategory(subsubCategoryId);
              setSelectedNotes(
                allNotes.filter(
                  (note) => note.subsubcategory_id === subsubCategoryId
                )
              );
            }}
          >
            {subsubCategories.map((subsubcategory) => (
              <option key={subsubcategory.id} value={subsubcategory.id}>
                {subsubcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-section">
          <h3>Notes</h3>

          {selectedNotes.length != 0 && (
            <ul>
              {selectedNotes.map((note) => (
                <li key={note.id}>
                  {note.title}
                  {note.id != noteId && (
                    <button onClick={() => addLinkedNote(note.id)}>Add</button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {selectedNotes.length === 0 && (
            <p>No notes found in this subsubcategory</p>
          )}
        </div>

        <div className="modal-section">
          <h3>Linked Notes</h3>

          {updatedlinkedNotes.length === 0 && <p>No linked notes</p>}
          <ul>
            {updatedlinkedNotes.map((id) => (
              <li key={id}>
                {allNotes.find((note) => note.id == id).title}
                <button onClick={() => removeLinkedNote(id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={saveLinkedNote}>Save</button>
        <button onClick={closeModal}>Close</button>
      </Modal>

      {linkedNotesContents.length > 0 && (
        <div className="subsubcategory-page-container">
          <div className="related-note-header">
            <h3 className="related-notes-title">Related Notes</h3>
            <select className="sort-selection" onClick={sortingnote}>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>

          {linkedNotesContents.map((linkedNote) =>
            linkedNote.map((note) => (
              <Note
                key={note.id}
                note={note}
                parentInfo={{
                  category: categories.find(
                    (category) => category.id == note.category_id
                  ).name,
                  subCategory: subCategories.find(
                    (subCategory) => subCategory.id == note.subcategory_id
                  ).name,
                  subsubCategory: subsubCategories.find(
                    (subsubCategory) =>
                      subsubCategory.id == note.subsubcategory_id
                  ).name,
                  categoryId: note.category_id,
                  subCategoryId: note.subcategory_id,
                  subsubCategoryId: note.subsubcategory_id,
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
