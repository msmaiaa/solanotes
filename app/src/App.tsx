import { useState } from "react";
import "./App.css";

function App() {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteTitle || !noteBody) return;
    console.log("title", noteTitle);
    console.log("body", noteBody);
  };

  return (
    <div className="page">
      <form onSubmit={onSubmit} className="form" autoComplete="off">
        <div className="input__container">
          <label htmlFor="form__title" className="input__label">
            Title
          </label>
          <input
            value={noteTitle}
            type="text"
            onChange={(e) => setNoteTitle(e.target.value)}
            id="form__title"
            className="form__field"
          />
        </div>
        <div className="input__container">
          <label htmlFor="form__body" className="input__label">
            Body
          </label>
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            id="form__body"
            className="form__field"
          />
        </div>
        <button type="submit" id="form__submit-btn">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
