import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
import { Solanotes } from "../target/types/solanotes";

describe("solanotes", () => {
  const { SystemProgram } = anchor.web3;
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solanotes as Program<Solanotes>;

  it("Initialized", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("note count:", account.totalNotes);
  });
});
