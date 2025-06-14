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
    <Card hover>
      <div className="flex items-start justify-between mb-4">
<div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">
            {unit}{safeCurrent.toLocaleString()} of {unit}{safeTarget.toLocaleString()}
          </p>
        </div>
        {icon && (
          <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
            <ApperIcon name={icon} size={20} />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{Math.round(percentage)}% complete</span>
<span className={`font-medium text-${color}`}>
            {unit}{(safeTarget - safeCurrent).toLocaleString()} to go
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={(colorClasses[color] || colorClasses.primary).split(' ')[0]}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </Card>
  )
}

export default ProgressCard