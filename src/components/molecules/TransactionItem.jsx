import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const TransactionItem = ({ transaction, index = 0 }) => {
  const isIncome = transaction.type === 'income'
  const amount = Math.abs(transaction.amount)
  
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Groceries': 'ShoppingCart',
      'Gas': 'Car',
      'Salary': 'DollarSign',
      'Dining': 'Utensils',
      'Rent': 'Home',
      'Transfer': 'ArrowRightLeft',
      'Utilities': 'Zap',
      'Entertainment': 'Play',
      'Shopping': 'Package',
      'Health': 'Heart'
    }
    return iconMap[category] || 'DollarSign'
  }

  const getCategoryColor = (category) => {
    const colorMap = {
      'Groceries': 'bg-green-100 text-green-600',
      'Gas': 'bg-blue-100 text-blue-600', 
      'Salary': 'bg-emerald-100 text-emerald-600',
      'Dining': 'bg-orange-100 text-orange-600',
      'Rent': 'bg-purple-100 text-purple-600',
      'Transfer': 'bg-gray-100 text-gray-600',
      'Utilities': 'bg-yellow-100 text-yellow-600',
      'Entertainment': 'bg-pink-100 text-pink-600',
      'Shopping': 'bg-indigo-100 text-indigo-600',
      'Health': 'bg-red-100 text-red-600'
    }
    return colorMap[category] || 'bg-gray-100 text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${getCategoryColor(transaction.category)}`}>
          <ApperIcon name={getCategoryIcon(transaction.category)} size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-sm text-gray-500">
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </p>
            <Badge variant="default" size="sm">{transaction.category}</Badge>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${isIncome ? 'text-success' : 'text-gray-900'}`}>
          {isIncome ? '+' : '-'}${amount.toLocaleString()}
        </p>
      </div>
    </motion.div>
  )
}

export default TransactionItem