import { AnchorProvider, Idl, Program, web3 } from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Note, WindowWithSolana } from "./types";
import CreateNoteForm from "./components/CreateNoteForm";
import NoteCard from "./components/Note";
import "./App.css";
import idl from "./idl.json";
import keypair from "./keypair.json";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";

const { SystemProgram } = web3;

const arr = Object.values(keypair._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programId = new PublicKey(idl.metadata.address);

const network = clusterApiUrl(import.meta.env.CLUSTER_URL);

function App() {
  const [userWallet, setUserWallet] = useState("");
  const [noteList, setNoteList] = useState<Array<Note> | null>([]);

  const checkWalletConnection = async () => {
    try {
      const { solana } = window as WindowWithSolana;
      if (!solana) {
        alert("Solana object not found");
        return;
      }
      if (!solana.isPhantom) {
        alert("Phantom wallet not found");
        return;
      }

      const response = await solana.connect({ onlyIfTrusted: true });
      setUserWallet(response.publicKey.toString());
    } catch (e) {
      console.error("Error connecting to wallet", e);
    }
  };

  const getProvider = () => {
    const { solana } = window as WindowWithSolana;
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, solana as Wallet, {
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

  const createNote = async (title: string, body: string) => {
    try {
      const provider = getProvider();
      const program = new Program(idl as Idl, programId, provider);
      await program.rpc.createNote(title, body, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
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
        <button onClick={createNoteAccount}>
          click here for the one-time account creation
        </button>
      );
    }
    return (
      <>
        {noteList.map((note) => (
          <NoteCard data={note} key={note.title} />
        ))}
      </>
    );
  };

  const renderWalletDisconnected = () => {
    return <p style={{ color: "white" }}>Please connect your wallet</p>;
  };
  return (
    <div className="page">
      <CreateNoteForm onSubmit={createNote} />
      {userWallet ? renderWalletConnected() : renderWalletDisconnected()}
    </div>
  );
}

export default App;
