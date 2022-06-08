import { Note } from "../../types";

type Props = {
  data: Note;
};

const NoteCard = ({ data: { title, body } }: Props) => (
  <div key={title} className="note__container">
    <h3 className="note__title">{title}</h3>
    <p className="note__body">{body}</p>
  </div>
);

export default NoteCard;
