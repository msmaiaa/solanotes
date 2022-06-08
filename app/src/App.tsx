import { Idl, Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useEffect, useState } from "react";
import keypair from "./keypair.json";
import idl from "./idl.json";
import "./App.css";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const { SystemProgram } = web3;

const arr = Object.values(keypair._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programId = new PublicKey(idl.metadata.address);

const network = clusterApiUrl("devnet");

type Note = {
  title: string;
  body: string;
};

function App() {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const [userWallet, setUserWallet] = useState("");
  const [noteList, setNoteList] = useState<Array<Note> | null>([]);

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

  const getProvider = () => {
    const { solana }: any = window;
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, solana, {
      preflightCommitment: "processed",
    });
    return provider;
  };

  const createNoteAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programId, provider);
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      await fetchNotes();
    } catch (e) {
      console.log("baseaccount", e);
    }
  };

  const createNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteTitle || !noteBody) return;
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programId, provider);
      await program.rpc.createNote(noteTitle, noteBody, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      setNoteTitle("");
      setNoteBody("");
      fetchNotes();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotes = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programId, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      setNoteList(account.notes as Array<Note>);
    } catch (e) {
      console.error("fetchNotes", e);
      setNoteList(null);
    }
  };

  useEffect(() => {
    const onLoad = async () => await checkWalletConnection();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (userWallet) {
      fetchNotes();
    }
  }, [userWallet]);

  const renderWalletConnected = () => {
    if (!noteList) {
      return (
        <button onClick={() => createNoteAccount()}>
          click here for the one-time account creation
        </button>
      );
    }
    return (
      <>
        <form onSubmit={createNote} className="form" autoComplete="off">
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
        {noteList.map((note) => {
          return (
            <div key={note.title} className="note__container">
              <h3 className="note__title">{note.title}</h3>
              <p className="note__body">{note.body}</p>
            </div>
          );
        })}
      </>
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
