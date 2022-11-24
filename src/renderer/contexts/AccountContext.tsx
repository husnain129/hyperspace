import type { IAccount } from 'main/db-api';
import React, { createContext } from 'react';

interface IAccountContext {
  account: IAccount;
  setAccount: (account: IAccount) => void;
}

export const AccountContext = createContext<IAccountContext>(
  null as unknown as IAccountContext
);

export default function AccountContextProvider({
  account,
  setAccount,
  children,
}: {
  account: IAccount;
  children: React.ReactNode;
  setAccount: (account: IAccount) => void;
}) {
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
}
