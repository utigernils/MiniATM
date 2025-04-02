import React, { useState } from "react";
import {
  ArrowLeftCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  QrCode,
} from "lucide-react";
import { Account, Transaction } from "../types";
import { updateAccount } from "../utils/storage";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  account: Account;
  onLogout: () => void;
}

export default function Dashboard({ account, onLogout }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdrawal"
  >("deposit");
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (transactionType === "withdrawal" && numAmount > account.balance) {
      alert("Insufficient funds");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: transactionType,
      amount: numAmount,
      date: new Date().toISOString(),
    };

    const updatedAccount: Account = {
      ...account,
      balance:
        transactionType === "deposit"
          ? account.balance + numAmount
          : account.balance - numAmount,
      transactions: [newTransaction, ...account.transactions],
    };

    updateAccount(updatedAccount);
    setShowModal(false);
    setAmount("");
    // Update the account prop
    Object.assign(account, updatedAccount);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">
          {account.name}'s Account
        </h1>
        <div>
          <button
            onClick={() => setShowQRCode(account.id)}
            className="text-slate-400 hover:text-blue-400 transition-colors mx-3"
          >
            <QrCode className="w-6 h-6" />
          </button>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeftCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-8 mb-8">
        <p className="text-slate-400 mb-2">Current Balance</p>
        <h2 className="text-5xl font-bold text-white">
          €{account.balance.toFixed(2)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => {
            setTransactionType("deposit");
            setShowModal(true);
          }}
          className="p-4 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
        >
          <ArrowUpCircle className="w-5 h-5 text-green-400" />
          <span className="text-white">Deposit</span>
        </button>
        <button
          onClick={() => {
            setTransactionType("withdrawal");
            setShowModal(true);
          }}
          className="p-4 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
        >
          <ArrowDownCircle className="w-5 h-5 text-red-400" />
          <span className="text-white">Withdraw</span>
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {account.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {transaction.type === "deposit" ? (
                  <ArrowUpCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold ${
                  transaction.type === "deposit"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "deposit" ? "+" : "-"}€
                {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
          {account.transactions.length === 0 && (
            <p className="text-slate-400 text-center py-4">
              No transactions yet
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 p-6 rounded-xl border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              {transactionType === "deposit" ? "Deposit" : "Withdraw"} Money
            </h2>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-4 text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleTransaction}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-3 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/90 p-6 rounded-xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Account QR Code
            </h2>
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCodeSVG
                value={showQRCode}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <button
              onClick={() => setShowQRCode(null)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-3 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
