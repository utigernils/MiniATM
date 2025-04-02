import { Account } from '../types';
import { addNotification } from './notifications';

export const getAccounts = (): Account[] => {
  const accounts = localStorage.getItem('accounts');
  return accounts ? JSON.parse(accounts) : [];
};

export const saveAccounts = (accounts: Account[]) => {
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

export const addAccount = (account: Account) => {
  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);
};

export const updateAccount = (account: Account) => {
  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.id === account.id);
  if (index !== -1) {
    accounts[index] = account;
    saveAccounts(accounts);
    addNotification('Transaction successfull', 'success');
  }
};