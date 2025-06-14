import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import TransactionItem from '@/components/molecules/TransactionItem'
import ApperIcon from '@/components/ApperIcon'
import { transactionService } from '@/services'
import { toast } from 'react-toastify'

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true)
      setError(null)
      try {
        const allTransactions = await transactionService.getAll()
        // Sort by date and take most recent 5
        const recent = allTransactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
        setTransactions(recent)
      } catch (err) {
        setError(err.message || 'Failed to load transactions')
        toast.error('Failed to load recent transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error mb-4">Error loading transactions: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="Receipt" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500 mb-4">Connect your accounts to see transactions here</p>
          <Button>Connect Account</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <Button variant="outline" size="sm">
          <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            index={index}
          />
        ))}
      </div>
    </Card>
  )
}

export default RecentTransactions