import transactionsData from '../mockData/transactions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.transactions];
  }

  async getById(id) {
    await delay(200);
    const transaction = this.transactions.find(t => t.id === id);
    return transaction ? { ...transaction } : null;
  }

  async getByAccountId(accountId) {
    await delay(250);
    return this.transactions.filter(t => t.accountId === accountId).map(t => ({ ...t }));
  }

  async create(transactionData) {
    await delay(400);
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      date: transactionData.date || new Date().toISOString().split('T')[0]
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, data) {
    await delay(300);
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...data };
      return { ...this.transactions[index] };
    }
    throw new Error('Transaction not found');
  }

  async delete(id) {
    await delay(250);
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return { success: true };
    }
    throw new Error('Transaction not found');
  }

  async getMonthlySpending() {
    await delay(300);
    const transactions = await this.getAll();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === thisMonth && 
               transactionDate.getFullYear() === thisYear;
      })
      .reduce((total, t) => total + Math.abs(t.amount), 0);
  }

  async getCategorySpending() {
    await delay(300);
    const transactions = await this.getAll();
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      });
    
    return categoryTotals;
  }
}

export default new TransactionService();