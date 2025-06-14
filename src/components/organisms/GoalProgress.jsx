import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ProgressCard from '@/components/molecules/ProgressCard'
import ApperIcon from '@/components/ApperIcon'
import { goalService } from '@/services'
import { toast } from 'react-toastify'

const GoalProgress = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true)
      setError(null)
      try {
        const goalData = await goalService.getAll()
        // Show top 3 goals
        setGoals(goalData.slice(0, 3))
      } catch (err) {
        setError(err.message || 'Failed to load goals')
        toast.error('Failed to load goal progress')
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [])

  const getGoalIcon = (type) => {
    const iconMap = {
      'savings': 'PiggyBank',
      'debt': 'CreditCard',
      'investment': 'TrendingUp'
    }
    return iconMap[type] || 'Target'
  }

  const getGoalColor = (type) => {
    const colorMap = {
      'savings': 'accent',
      'debt': 'error',
      'investment': 'secondary'
    }
    return colorMap[type] || 'primary'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Goal Progress</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ProgressCard key={i} loading={true} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error mb-4">Error loading goals: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (goals.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="Target" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
          <p className="text-gray-500 mb-4">Set your first financial goal to start tracking progress</p>
          <Button>Create Goal</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Goal Progress</h2>
        <Button variant="outline" size="sm">
          <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProgressCard
              title={goal.name}
              current={goal.currentAmount}
              target={goal.targetAmount}
              icon={getGoalIcon(goal.type)}
              color={getGoalColor(goal.type)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default GoalProgress