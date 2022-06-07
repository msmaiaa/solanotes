import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
import { Solanotes } from "../target/types/solanotes";

describe("solanotes", () => {
  const { SystemProgram } = anchor.web3;
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solanotes as Program<Solanotes>;

  const initialize = async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    return baseAccount;
  };

  it("should initialize the account", async () => {
    const baseAccount = await initialize();
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    expect(account.notes).to.eql([]);
    expect(account.totalNotes).to.eql(0);
  });
  it("should create a note", async () => {
    const baseAccount = await initialize();
    await program.rpc.createNote("hello world", "this is a cool note body", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    const { userAddress, ...note } = account.notes[0];
    expect(account.totalNotes).to.eql(1);
    expect(note).to.eql({
      title: "hello world",
      body: "this is a cool note body",
    });
  });
});
