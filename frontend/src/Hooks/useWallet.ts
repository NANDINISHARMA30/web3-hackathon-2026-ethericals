import { useState, useCallback, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

type WalletState = {
  address: string | null;
  chainId: string | null;
  connecting: boolean;
  error: string | null;
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    connecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((s) => ({ ...s, error: "MetaMask not found — install the extension." }));
      return;
    }
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const chainId = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;
      setState({ address: accounts[0], chainId, connecting: false, error: null });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection rejected";
      setState((s) => ({ ...s, connecting: false, error: msg }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ address: null, chainId: null, connecting: false, error: null });
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[];
      if (list.length === 0) {
        setState({ address: null, chainId: null, connecting: false, error: null });
      } else {
        setState((s) => ({ ...s, address: list[0] }));
      }
    };
    const onChainChanged = (chainId: unknown) => {
      setState((s) => ({ ...s, chainId: chainId as string }));
    };
    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener("chainChanged", onChainChanged);
    };
  }, []);

  const isSepolia = state.chainId === "0xaa36a7";
  const shortAddress = state.address
    ? `${state.address.slice(0, 6)}…${state.address.slice(-4)}`
    : null;

  return { ...state, connect, disconnect, isSepolia, shortAddress };
}
