import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ProgressCard from '@/components/molecules/ProgressCard'
import ApperIcon from '@/components/ApperIcon'
import { goalService } from '@/services'
import { toast } from 'react-toastify'
import { format, differenceInDays } from 'date-fns'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddProgress, setShowAddProgress] = useState(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    type: 'savings'
  })
  const [progressAmount, setProgressAmount] = useState('')

  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true)
      setError(null)
      try {
        const goalData = await goalService.getAll()
        setGoals(goalData)
      } catch (err) {
        setError(err.message || 'Failed to load goals')
        toast.error('Failed to load goals')
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [])

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const goalData = {
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0
      }
      
      const createdGoal = await goalService.create(goalData)
      setGoals([...goals, createdGoal])
      setNewGoal({ name: '', targetAmount: '', targetDate: '', type: 'savings' })
      setShowAddGoal(false)
      toast.success('Goal created successfully')
    } catch (err) {
      toast.error('Failed to create goal')
    }
  }

  const handleAddProgress = async (goalId) => {
    if (!progressAmount || parseFloat(progressAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      const updatedGoal = await goalService.updateProgress(goalId, parseFloat(progressAmount))
      setGoals(goals.map(goal => goal.id === goalId ? updatedGoal : goal))
      setProgressAmount('')
      setShowAddProgress(null)
      toast.success('Progress updated successfully')
    } catch (err) {
      toast.error('Failed to update progress')
    }
  }

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getDaysRemaining = (targetDate) => {
    return differenceInDays(new Date(targetDate), new Date())
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600">Track progress toward your financial objectives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProgressCard key={i} loading={true} />
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
        <p className="text-error mb-4">Error loading goals: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
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
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600">Track progress toward your financial objectives</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <ApperIcon name="Target" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
            <p className="text-gray-500 mb-4">Create your first financial goal to start tracking progress</p>
            <Button onClick={() => setShowAddGoal(true)}>
              Create Your First Goal
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${getGoalColor(goal.type)}/10 text-${getGoalColor(goal.type)}`}>
                      <ApperIcon name={getGoalIcon(goal.type)} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{goal.type} goal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddProgress(goal.id)}
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`bg-${getGoalColor(goal.type)} h-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="font-semibold">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Target Date</span>
                      <span className="font-medium">
                        {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Days Remaining</span>
                      <span className={`font-medium ${
                        getDaysRemaining(goal.targetDate) < 30 ? 'text-warning' : 'text-gray-900'
                      }`}>
                        {getDaysRemaining(goal.targetDate)} days
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <Input
                label="Goal Name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g., Emergency Fund"
                required
              />
              
              <Input
                label="Target Amount"
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <Input
                label="Target Date"
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Type
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="savings">Savings</option>
                  <option value="debt">Debt Payoff</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Progress Modal */}
      {showAddProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Progress</h3>
              <button
                onClick={() => setShowAddProgress(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Amount to Add"
                type="number"
                value={progressAmount}
                onChange={(e) => setProgressAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddProgress(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleAddProgress(showAddProgress)}
                >
                  Add Progress
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Goals