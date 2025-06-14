import React from 'react'
import { motion } from 'framer-motion'
import DashboardStats from '@/components/organisms/DashboardStats'
import RecentTransactions from '@/components/organisms/RecentTransactions'
import BudgetOverview from '@/components/organisms/BudgetOverview'
import GoalProgress from '@/components/organisms/GoalProgress'
import AlertCenter from '@/components/organisms/AlertCenter'

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-full overflow-hidden"
    >
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Financial Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Transactions & Budget */}
        <div className="lg:col-span-2 space-y-8">
          <RecentTransactions />
          <BudgetOverview />
        </div>

        {/* Right Column - Goals & Alerts */}
        <div className="space-y-8">
          <GoalProgress />
          <AlertCenter />
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard