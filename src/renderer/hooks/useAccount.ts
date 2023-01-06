import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from 'renderer/contexts/AccountContext';

export default function useAccount() {
  const { account, setAccount } = useContext(AccountContext);

  return {
    account,
    setAccount,
  };
}
