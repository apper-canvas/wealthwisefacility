import accountsData from '../mockData/accounts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AccountService {
  constructor() {
    this.accounts = [...accountsData];
  }

  async getAll() {
    await delay(300);
    return [...this.accounts];
  }

  async getById(id) {
    await delay(200);
    const account = this.accounts.find(acc => acc.id === id);
    return account ? { ...account } : null;
  }

  async create(accountData) {
    await delay(400);
    const newAccount = {
      ...accountData,
      id: Date.now().toString(),
      lastSync: new Date().toISOString()
    };
    this.accounts.push(newAccount);
    return { ...newAccount };
  }

  async update(id, data) {
    await delay(300);
    const index = this.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
      this.accounts[index] = { ...this.accounts[index], ...data };
      return { ...this.accounts[index] };
    }
    throw new Error('Account not found');
  }

  async delete(id) {
    await delay(250);
    const index = this.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      return { success: true };
    }
    throw new Error('Account not found');
  }

  async getTotalBalance() {
    await delay(200);
    const accounts = await this.getAll();
    return accounts.reduce((total, account) => {
      if (account.type === 'credit') {
        return total - account.balance;
      }
      return total + account.balance;
    }, 0);
  }
}

export default new AccountService();