import budgetsData from '../mockData/budgets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await delay(300);
    return [...this.budgets];
  }

  async getByCategory(category) {
    await delay(200);
    const budget = this.budgets.find(b => b.category === category);
    return budget ? { ...budget } : null;
  }

  async create(budgetData) {
    await delay(400);
    const newBudget = {
      ...budgetData,
      spent: budgetData.spent || 0
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(category, data) {
    await delay(300);
    const index = this.budgets.findIndex(b => b.category === category);
    if (index !== -1) {
      this.budgets[index] = { ...this.budgets[index], ...data };
      return { ...this.budgets[index] };
    }
    throw new Error('Budget not found');
  }

  async delete(category) {
    await delay(250);
    const index = this.budgets.findIndex(b => b.category === category);
    if (index !== -1) {
      this.budgets.splice(index, 1);
      return { success: true };
    }
    throw new Error('Budget not found');
  }

  async getTotalBudget() {
    await delay(200);
    const budgets = await this.getAll();
    return budgets.reduce((total, budget) => total + budget.limit, 0);
  }

  async getTotalSpent() {
    await delay(200);
    const budgets = await this.getAll();
    return budgets.reduce((total, budget) => total + budget.spent, 0);
  }
}

export default new BudgetService();