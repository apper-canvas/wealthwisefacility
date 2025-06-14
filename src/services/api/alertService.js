import alertsData from '../mockData/alerts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AlertService {
  constructor() {
    this.alerts = [...alertsData];
  }

  async getAll() {
    await delay(300);
    return [...this.alerts];
  }

  async getById(id) {
    await delay(200);
    const alert = this.alerts.find(a => a.id === id);
    return alert ? { ...alert } : null;
  }

  async create(alertData) {
    await delay(400);
    const newAlert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.alerts.unshift(newAlert);
    return { ...newAlert };
  }

  async markAsRead(id) {
    await delay(250);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts[index] = { ...this.alerts[index], read: true };
      return { ...this.alerts[index] };
    }
    throw new Error('Alert not found');
  }

  async delete(id) {
    await delay(250);
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alerts.splice(index, 1);
      return { success: true };
    }
    throw new Error('Alert not found');
  }

  async getUnreadCount() {
    await delay(200);
    const alerts = await this.getAll();
    return alerts.filter(alert => !alert.read).length;
  }
}

export default new AlertService();