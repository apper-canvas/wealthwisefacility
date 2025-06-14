import Dashboard from '@/components/pages/Dashboard';
import Accounts from '@/components/pages/Accounts';
import Budget from '@/components/pages/Budget';
import Investments from '@/components/pages/Investments';
import Goals from '@/components/pages/Goals';
import Insights from '@/components/pages/Insights';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  accounts: {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
    icon: 'CreditCard',
    component: Accounts
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',  
    icon: 'PieChart',
    component: Budget
  },
  investments: {
    id: 'investments',
    label: 'Investments',
    path: '/investments',
    icon: 'TrendingUp',
    component: Investments
  },
  goals: {
    id: 'goals',
    label: 'Goals',
    path: '/goals',
    icon: 'Target',
    component: Goals
  },
insights: {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: 'Lightbulb',
    component: Insights
  },
  transactions: {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: 'Receipt',
    component: null // Component needs to be created
  }
};

export const routeArray = Object.values(routes);
export default routes;