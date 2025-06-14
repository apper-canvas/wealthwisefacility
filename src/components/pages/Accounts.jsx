import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { accountService, transactionService } from '@/services'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true)
      setError(null)
      try {
        const accountData = await accountService.getAll()
        setAccounts(accountData)
        if (accountData.length > 0) {
          setSelectedAccount(accountData[0])
        }
      } catch (err) {
        setError(err.message || 'Failed to load accounts')
        toast.error('Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      const loadTransactions = async () => {
        try {
          const accountTransactions = await transactionService.getByAccountId(selectedAccount.id)
          setTransactions(accountTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)))
        } catch (err) {
          toast.error('Failed to load transactions')
        }
      }
      loadTransactions()
    }
  }, [selectedAccount])

  const getAccountIcon = (type) => {
    const iconMap = {
      'checking': 'CreditCard',
      'savings': 'PiggyBank',
      'credit': 'CreditCard',
      'investment': 'TrendingUp'
    }
    return iconMap[type] || 'Wallet'
  }

  const getAccountColor = (type) => {
    const colorMap = {
      'checking': 'primary',
      'savings': 'success',
      'credit': 'warning',
      'investment': 'secondary'
    }
    return colorMap[type] || 'default'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Accounts</h1>
          <p className="text-gray-600">Manage your connected financial accounts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
        <p className="text-error mb-4">Error loading accounts: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    )
  }

  if (accounts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ApperIcon name="CreditCard" size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
        <p className="text-gray-500 mb-4">Connect your first account to get started</p>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Connect Account
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-full overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Accounts</h1>
          <p className="text-gray-600">Manage your connected financial accounts</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              hover
              className={`cursor-pointer transition-all ${
                selectedAccount?.id === account.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : ''
              }`}
              onClick={() => setSelectedAccount(account)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${getAccountColor(account.type)}/10 text-${getAccountColor(account.type)}`}>
                      <ApperIcon name={getAccountIcon(account.type)} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <Badge variant={getAccountColor(account.type)} size="sm">
                        {account.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last sync: {format(new Date(account.lastSync), 'MMM dd, h:mm a')}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      {selectedAccount && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History - {selectedAccount.name}
            </h2>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Receipt" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found for this account</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg">
                      <ApperIcon name="Receipt" size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                        <Badge variant="default" size="sm">{transaction.category}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-gray-900'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      )}
    </motion.div>
  )
}

export default Accounts