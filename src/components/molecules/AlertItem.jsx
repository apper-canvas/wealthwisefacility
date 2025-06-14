import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const AlertItem = ({ alert, onMarkAsRead, onDelete, index = 0 }) => {
  const getAlertIcon = (type) => {
    const iconMap = {
      'budget': 'PieChart',
      'goal': 'Target',
      'insight': 'Lightbulb',
      'market': 'TrendingUp'
    }
    return iconMap[type] || 'Bell'
  }

  const getAlertColor = (priority) => {
    const colorMap = {
      'high': 'error',
      'medium': 'warning',
      'low': 'info'
    }
    return colorMap[priority] || 'default'
  }

  const getPriorityIcon = (priority) => {
    const iconMap = {
      'high': 'AlertTriangle',
      'medium': 'AlertCircle',
      'low': 'Info'
    }
    return iconMap[priority] || 'Bell'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border transition-all ${
        alert.read 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-white border-gray-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${
            alert.read ? 'bg-gray-200 text-gray-500' : 'bg-primary/10 text-primary'
          }`}>
            <ApperIcon name={getAlertIcon(alert.type)} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={getAlertColor(alert.priority)} size="sm">
                <ApperIcon name={getPriorityIcon(alert.priority)} size={12} className="mr-1" />
                {alert.priority}
              </Badge>
              <Badge variant="default" size="sm">{alert.type}</Badge>
            </div>
            
            <p className={`text-sm break-words ${
              alert.read ? 'text-gray-600' : 'text-gray-900 font-medium'
            }`}>
              {alert.message}
            </p>
            
            <p className="text-xs text-gray-500 mt-2">
              {format(new Date(alert.timestamp), 'MMM dd, yyyy h:mm a')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {!alert.read && (
            <button
              onClick={() => onMarkAsRead(alert.id)}
              className="p-1 text-gray-400 hover:text-primary transition-colors"
              title="Mark as read"
            >
              <ApperIcon name="Check" size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(alert.id)}
            className="p-1 text-gray-400 hover:text-error transition-colors"
            title="Delete alert"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AlertItem