import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const ProgressCard = ({ 
  title, 
  current, 
  target, 
  unit = '$',
  color = 'primary',
  icon,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </Card>
    )
}

  // Ensure numeric props are valid
  const safeCurrent = current || 0
  const safeTarget = target || 1
  const percentage = Math.min((safeCurrent / safeTarget) * 100, 100)
  
  const colorClasses = {
    primary: 'bg-primary text-primary',
    secondary: 'bg-secondary text-secondary',
    accent: 'bg-accent text-accent',
    success: 'bg-success text-success'
  }

return (
    <Card hover className="group">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-2 text-base group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {unit}{safeCurrent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              of {unit}{safeTarget.toLocaleString()} goal
            </p>
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-${color}/10 text-${color} group-hover:bg-${color}/15 transition-colors`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}% complete
          </span>
          <span className={`text-sm font-bold text-${color}`}>
            {unit}{(safeTarget - safeCurrent).toLocaleString()} remaining
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`${(colorClasses[color] || colorClasses.primary).split(' ')[0]} rounded-full h-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: 0.2
              }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProgressCard