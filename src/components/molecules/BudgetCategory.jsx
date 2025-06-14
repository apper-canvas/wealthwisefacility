import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const BudgetCategory = ({ budget, index = 0 }) => {
  const percentage = (budget.spent / budget.limit) * 100
  const remaining = budget.limit - budget.spent
  
  const getStatusColor = () => {
    if (percentage >= 90) return 'error'
    if (percentage >= 75) return 'warning' 
    return 'success'
  }
  
  const statusColor = getStatusColor()
  
  const colorClasses = {
    success: 'bg-success text-success',
    warning: 'bg-warning text-warning',
    error: 'bg-error text-error'
  }

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Groceries': 'ShoppingCart',
      'Dining': 'Utensils',
      'Gas': 'Car',
      'Entertainment': 'Play',
      'Shopping': 'Package',
      'Health': 'Heart'
    }
    return iconMap[category] || 'DollarSign'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ApperIcon name={getCategoryIcon(budget.category)} size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{budget.category}</h3>
              <p className="text-sm text-gray-500">{budget.period}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ${budget.spent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              of ${budget.limit.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{Math.round(percentage)}% used</span>
            <span className={`font-medium text-${statusColor}`}>
              ${remaining.toLocaleString()} left
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={colorClasses[statusColor].split(' ')[0]}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ height: '100%' }}
            />
          </div>
          
          {percentage >= 75 && (
            <div className={`flex items-center space-x-2 p-2 rounded-lg bg-${statusColor}/10`}>
              <ApperIcon 
                name={percentage >= 90 ? "AlertTriangle" : "AlertCircle"} 
                size={16} 
                className={`text-${statusColor}`} 
              />
              <p className={`text-sm font-medium text-${statusColor}`}>
                {percentage >= 90 ? 'Budget almost exceeded!' : 'Approaching budget limit'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default BudgetCategory