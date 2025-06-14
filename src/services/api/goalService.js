import goalsData from '../mockData/goals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GoalService {
  constructor() {
    this.goals = [...goalsData];
  }

  async getAll() {
    await delay(300);
    return [...this.goals];
  }

  async getById(id) {
    await delay(200);
    const goal = this.goals.find(g => g.id === id);
    return goal ? { ...goal } : null;
  }

  async create(goalData) {
    await delay(400);
    const newGoal = {
      ...goalData,
      id: Date.now().toString(),
      currentAmount: goalData.currentAmount || 0
    };
    this.goals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, data) {
    await delay(300);
    const index = this.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      this.goals[index] = { ...this.goals[index], ...data };
      return { ...this.goals[index] };
    }
    throw new Error('Goal not found');
  }

  async delete(id) {
    await delay(250);
    const index = this.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      this.goals.splice(index, 1);
      return { success: true };
    }
    throw new Error('Goal not found');
  }

  async updateProgress(id, amount) {
    await delay(300);
    const goal = await this.getById(id);
    if (goal) {
      const updatedGoal = await this.update(id, {
        currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount)
      });
      return updatedGoal;
    }
    throw new Error('Goal not found');
  }
}

export default new GoalService();