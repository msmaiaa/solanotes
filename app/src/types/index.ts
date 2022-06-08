import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { PublicKey } from "@solana/web3.js";

export type Note = {
  title: string;
  body: string;
};

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider extends Wallet {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
}

export type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};
