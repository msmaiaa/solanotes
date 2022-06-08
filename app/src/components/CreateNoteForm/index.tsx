import React, { useState } from "react";

type Props = {
  onSubmit: (title: string, body: string) => void;
};
const CreateNoteForm = ({ onSubmit }: Props) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteTitle || !noteBody) return;
    onSubmit(noteTitle, noteBody);
    setNoteTitle("");
    setNoteBody("");
  };
  return (
    <form onSubmit={onSend} className="form" autoComplete="off">
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
  );
};

export default CreateNoteForm;
