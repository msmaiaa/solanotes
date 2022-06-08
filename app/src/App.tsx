import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const [userWallet, setUserWallet] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteTitle || !noteBody) return;
    console.log("title", noteTitle);
    console.log("body", noteBody);
  };

  const checkWalletConnection = async () => {
    try {
      const { solana }: any = window;
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTruste: true });
          setUserWallet(response.publicKey.toString());
        } else {
          alert("Phantom wallet not found");
        }
      } else {
        alert("Solana wallet not found");
      }
    } catch (_) {}
  };

  useEffect(() => {
    const onLoad = async () => await checkWalletConnection();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    console.log("wallet", userWallet);
    if (userWallet) {
      console.log("userWallet", userWallet);
    }
  }, [userWallet]);

  const renderWalletConnected = () => {
    return (
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
    );
  };

  const renderWalletDisconnected = () => {
    return <p style={{ color: "white" }}>Please connect your wallet</p>;
  };
  return (
    <div className="page">
      {userWallet ? renderWalletConnected() : renderWalletDisconnected()}
    </div>
  );
}

export default App;
