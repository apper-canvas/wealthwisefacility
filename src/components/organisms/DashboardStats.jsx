import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import { accountService, transactionService } from '@/services'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const [accounts, transactions] = await Promise.all([
          accountService.getAll(),
          transactionService.getAll()
        ])

        // Calculate total balance (excluding credit cards as debt)
        const totalBalance = accounts.reduce((total, account) => {
          if (account.type === 'credit') {
            return total - account.balance
          }
          return total + account.balance
        }, 0)

        // Calculate monthly income and expenses
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()
        
        const monthlyTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() === thisMonth && 
                 transactionDate.getFullYear() === thisYear
        })

        const monthlyIncome = monthlyTransactions
          .filter(t => t.type === 'income')
          .reduce((total, t) => total + Math.abs(t.amount), 0)

        const monthlyExpenses = monthlyTransactions
          .filter(t => t.type === 'expense')
          .reduce((total, t) => total + Math.abs(t.amount), 0)

        const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

        setStats({
          totalBalance,
          monthlyIncome,
          monthlyExpenses,
          savingsRate
        })
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error">Error loading dashboard stats: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MetricCard
          title="Net Worth"
          value={formatCurrency(stats.totalBalance)}
          change="+5.2%"
          changeType="positive"
          icon="Wallet"
          color="primary"
          loading={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MetricCard
          title="Monthly Income"
          value={formatCurrency(stats.monthlyIncome)}
          change="+2.1%"
          changeType="positive"
          icon="TrendingUp"
          color="success"
          loading={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MetricCard
          title="Monthly Expenses"
          value={formatCurrency(stats.monthlyExpenses)}
          change="-8.5%"
          changeType="positive"
          icon="CreditCard"
          color="warning"
          loading={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <MetricCard
          title="Savings Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          change="+12.3%"
          changeType="positive"
          icon="PiggyBank"
          color="accent"
          loading={loading}
        />
      </motion.div>
    </div>
  )
}

export default DashboardStats