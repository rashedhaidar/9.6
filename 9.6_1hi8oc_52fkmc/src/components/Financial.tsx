import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
    import { Coins, ArrowDown, ArrowUp, Plus, Minus, Edit2, Trash2, Calendar, PieChart } from 'lucide-react';
    import { formatDate, getWeekNumber } from '../utils/dateUtils';
    import { ActivityContext } from '../context/ActivityContext';
    import { useContext } from 'react';

    interface Transaction {
      id: string;
      type: 'income' | 'expense';
      name: string;
      amount: number;
      date: string;
      createActivity: boolean;
    }

    export function Financial() {
      const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
      const [transactions1, setTransactions1] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('financialTransactions1');
        return saved ? JSON.parse(saved) : [];
      });
      const [transactions2, setTransactions2] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('financialTransactions2');
        return saved ? JSON.parse(saved) : [];
      });
      const [balance1, setBalance1] = useState(0);
      const [balance2, setBalance2] = useState(0);
      const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
        type: 'expense',
        name: '',
        amount: NaN,
        date: formatDate(new Date()),
        createActivity: true,
      });
      const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
      const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
      const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
      const { addActivity, updateActivity, deleteActivity, activities } = useContext(ActivityContext);
      const dateInputRef = useRef<HTMLInputElement>(null);
      const [datePickerKey, setDatePickerKey] = useState(Date.now());

      useEffect(() => {
        localStorage.setItem('financialTransactions1', JSON.stringify(transactions1));
        calculateBalance1();
      }, [transactions1, selectedMonth, selectedYear]);

      useEffect(() => {
        localStorage.setItem('financialTransactions2', JSON.stringify(transactions2));
        calculateBalance2();
      }, [transactions2, selectedMonth, selectedYear]);

      const calculateBalance1 = useCallback(() => {
        const newBalance = transactions1.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        }).reduce((acc, transaction) => {
          return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        setBalance1(newBalance);
      }, [transactions1, selectedMonth, selectedYear]);

      const calculateBalance2 = useCallback(() => {
        const newBalance = transactions2.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        }).reduce((acc, transaction) => {
          return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        setBalance2(newBalance);
      }, [transactions2, selectedMonth, selectedYear]);

      const handleAddTransaction = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!newTransaction.name || isNaN(newTransaction.amount)) return;

        const transaction: Transaction = {
          id: crypto.randomUUID(),
          ...newTransaction,
        };
        if (activeTab === 'tab1') {
          setTransactions1(prev => [...prev, transaction]);
        } else {
          setTransactions2(prev => [...prev, transaction]);
        }

        if (newTransaction.createActivity) {
          const transactionDate = new Date(newTransaction.date);
          const weekNumber = getWeekNumber(transactionDate);
          const year = transactionDate.getFullYear();

          addActivity({
            title: `${transaction.type === 'income' ? 'إيرادات' : 'نفقات'} - ${transaction.name}`,
            description: `المبلغ: ${transaction.amount}`,
            domainId: 'financial',
            selectedDays: [transactionDate.getDay()],
            allowSunday: true,
            weekNumber,
            year,
            completedDays: {
              [transactionDate.getDay()]: true
            }
          });
        }

        const today = new Date();
        setNewTransaction({ type: 'expense', name: '', amount: NaN, date: formatDate(today), createActivity: true });
        setDatePickerKey(Date.now());
        if (dateInputRef.current) {
          dateInputRef.current.value = formatDate(today);
        }
      }, [newTransaction, addActivity, activeTab]);

      const handleEditTransaction = useCallback((transaction: Transaction) => {
        setEditingTransaction(transaction);
        setNewTransaction(transaction);
        if (dateInputRef.current) {
          dateInputRef.current.value = transaction.date;
        }
        setDatePickerKey(Date.now());
      }, []);

      const handleUpdateTransaction = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTransaction) return;

        if (activeTab === 'tab1') {
          setTransactions1(prev =>
            prev.map(transaction =>
              transaction.id === editingTransaction.id ? { ...newTransaction, id: editingTransaction.id } : transaction
            )
          );
        } else {
          setTransactions2(prev =>
            prev.map(transaction =>
              transaction.id === editingTransaction.id ? { ...newTransaction, id: editingTransaction.id } : transaction
            )
          );
        }
        setEditingTransaction(null);
        const today = new Date();
        setNewTransaction({ type: 'expense', name: '', amount: NaN, date: formatDate(today), createActivity: true });
        if (dateInputRef.current) {
          dateInputRef.current.value = formatDate(today);
        }
        setDatePickerKey(Date.now());
      }, [editingTransaction, newTransaction, activeTab]);

      const handleDeleteTransaction = useCallback((id: string) => {
        let transactionToDelete;
        if (activeTab === 'tab1') {
          transactionToDelete = transactions1.find(transaction => transaction.id === id);
          setTransactions1(prev => prev.filter(transaction => transaction.id !== id));
        } else {
          transactionToDelete = transactions2.find(transaction => transaction.id === id);
          setTransactions2(prev => prev.filter(transaction => transaction.id !== id));
        }
        if (transactionToDelete && transactionToDelete.createActivity) {
          const transactionDate = new Date(transactionToDelete.date);
          const weekNumber = getWeekNumber(transactionDate);
          const year = transactionDate.getFullYear();
          const activityToDelete = activities.find(activity =>
            activity.title === `${transactionToDelete.type === 'income' ? 'إيرادات' : 'نفقات'} - ${transactionToDelete.name}` &&
            activity.description === `المبلغ: ${transactionToDelete.amount}` &&
            activity.domainId === 'financial' &&
            activity.weekNumber === weekNumber &&
            activity.year === year
          );
          if (activityToDelete) {
            deleteActivity(activityToDelete.id);
          }
        }
      }, [activities, deleteActivity, transactions1, transactions2, activeTab]);

      const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTransaction(prev => ({ ...prev, date: e.target.value }));
      }, [setNewTransaction]);

      const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(parseInt(e.target.value));
      }, [setSelectedMonth]);

      const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(parseInt(e.target.value));
      }, [setSelectedYear]);

      const getMonthName = (month: number) => {
        const monthNames = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
        return monthNames[month];
      };

      const inputClasses = "w-full p-2 border rounded-md bg-black/20 text-white border-amber-400/30 placeholder-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none";

      const filteredTransactions = useMemo(() => {
        const transactions = activeTab === 'tab1' ? transactions1 : transactions2;
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
        });
      }, [transactions1, transactions2, selectedMonth, selectedYear, activeTab]);

      const currentYear = new Date().getFullYear();
      const yearOptions = useMemo(() => Array.from({ length: 5 }, (_, i) => currentYear - 2 + i), [currentYear]);

      const expenseCategories = useMemo(() => {
        const categories = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, transaction) => {
          acc[transaction.name] = (acc[transaction.name] || 0) + transaction.amount;
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(categories).sort(([, a], [, b]) => b - a);
      }, [filteredTransactions]);

      return (
        <div className="p-6 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 rounded-lg shadow-lg text-white" dir="rtl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Coins size={32} />
              إدارة المصاريف
            </h2>
            <div className="text-xl font-bold">
              الرصيد: <span className={activeTab === 'tab1' ? (balance1 >= 0 ? 'text-green-400' : 'text-red-400') : (balance2 >= 0 ? 'text-green-400' : 'text-red-400')}>{activeTab === 'tab1' ? balance1 : balance2}</span> $
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="month-select" className="text-white text-sm ml-1" dir="rtl">الشهر:</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className={`${inputClasses} text-center`}
                dir="rtl"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{getMonthName(i)}</option>
                ))}
              </select>
              <label htmlFor="year-select" className="text-white text-sm ml-1" dir="rtl">السنة:</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className={inputClasses}
                dir="rtl"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <h3 className="text-xl font-medium text-white">{getMonthName(selectedMonth)} - {selectedYear}</h3>
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('tab1')}
              className={`p-2 rounded-md ${activeTab === 'tab1' ? 'bg-amber-400 text-black' : 'bg-black/20 text-white hover:bg-white/10'}`}
            >
              صندوق رقم 1
            </button>
            <button
              onClick={() => setActiveTab('tab2')}
              className={`p-2 rounded-md ${activeTab === 'tab2' ? 'bg-amber-400 text-black' : 'bg-black/20 text-white hover:bg-white/10'}`}
            >
              صندوق رقم 2
            </button>
          </div>
          <div className="bg-black/20 p-6 rounded-lg mb-6">
            <form onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction} className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                  className={inputClasses}
                >
                  <option value="income">إيرادات</option>
                  <option value="expense">نفقات</option>
                </select>
                <input
                  type="text"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم العملية"
                  className={inputClasses}
                  dir="rtl"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={isNaN(newTransaction.amount) ? '' : newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  placeholder="المبلغ"
                  className={inputClasses}
                />
                <div className="relative">
                  <input
                    type="date"
                    ref={dateInputRef}
                    value={newTransaction.date}
                    onChange={handleDateChange}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="createActivity"
                  checked={newTransaction.createActivity}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, createActivity: e.target.checked }))}
                />
                <label htmlFor="createActivity" className="text-white" dir="rtl">
                  إنشاء نشاط في الأيام والمجالات
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black p-2 rounded-md hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 font-medium"
              >
                {editingTransaction ? 'تعديل العملية' : 'إضافة عملية'}
                {editingTransaction ? <Edit2 size={20} /> : <Plus size={20} />}
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-white border border-white/20">النوع</th>
                  <th className="p-2 text-white border border-white/20">الاسم</th>
                  <th className="p-2 text-white border border-white/20">المبلغ</th>
                  <th className="p-2 text-white border border-white/20">التاريخ</th>
                  <th className="p-2 text-white border border-white/20"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-black/20 transition-colors">
                    <td className="p-2 text-white border border-white/20 text-center">
                      {transaction.type === 'income' ? (
                        <ArrowUp size={20} className="text-green-400 inline-block" />
                      ) : (
                        <ArrowDown size={20} className="text-red-400 inline-block" />
                      )}
                    </td>
                    <td className="p-2 text-white border border-white/20 text-right">{transaction.name}</td>
                    <td className="p-2 text-white border border-white/20 text-center">{transaction.amount} $</td>
                    <td className="p-2 text-white border border-white/20 text-center">{transaction.date}</td>
                    <td className="p-2 text-white border border-white/20 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="text-amber-400/70 hover:text-amber-400 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-black/20 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-medium text-amber-400 mb-4 flex items-center gap-2">
              <PieChart size={24} />
              ملخص المصروفات
            </h3>
            <div className="flex flex-wrap gap-4">
              {expenseCategories.map(([category, amount]) => (
                <div key={category} className="bg-amber-900/20 p-3 rounded-md text-amber-400">
                  <p className="font-medium">{category}</p>
                  <p className="text-sm">المبلغ: {amount} $</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
