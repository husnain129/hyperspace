import { useContext } from 'react';
import { AccountContext } from 'renderer/contexts/AccountContext';

export default function useAccount() {
  const { account, setAccount } = useContext(AccountContext);
  return {
    account,
  };
}
