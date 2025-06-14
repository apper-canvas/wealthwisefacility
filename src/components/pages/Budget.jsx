import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import BudgetCategory from '@/components/molecules/BudgetCategory'
import ApperIcon from '@/components/ApperIcon'
import { budgetService, transactionService } from '@/services'
import { toast } from 'react-toastify'

const Budget = () => {
  const [budgets, setBudgets] = useState([])
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  })

  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true)
      setError(null)
      try {
        const [budgetData, categorySpending] = await Promise.all([
          budgetService.getAll(),
          transactionService.getCategorySpending()
        ])

        // Update budgets with actual spending
        const updatedBudgets = budgetData.map(budget => ({
          ...budget,
          spent: categorySpending[budget.category] || 0
        }))

        setBudgets(updatedBudgets)
        setTotalBudget(updatedBudgets.reduce((sum, b) => sum + b.limit, 0))
        setTotalSpent(updatedBudgets.reduce((sum, b) => sum + b.spent, 0))
      } catch (err) {
        setError(err.message || 'Failed to load budgets')
        toast.error('Failed to load budget data')
      } finally {
        setLoading(false)
      }
    }

    loadBudgets()
  }, [])

  const handleAddBudget = async (e) => {
    e.preventDefault()
    if (!newBudget.category || !newBudget.limit) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const budgetData = {
        ...newBudget,
        limit: parseFloat(newBudget.limit),
        spent: 0
      }
      
      await budgetService.create(budgetData)
      setBudgets([...budgets, budgetData])
      setNewBudget({ category: '', limit: '', period: 'monthly' })
      setShowAddBudget(false)
      toast.success('Budget category created successfully')
    } catch (err) {
      toast.error('Failed to create budget category')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Budget</h1>
          <p className="text-gray-600">Track and manage your spending by category</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Budget Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
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
        <p className="text-error mb-4">Error loading budget: {error}</p>
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
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Budget</h1>
          <p className="text-gray-600">Track and manage your spending by category</p>
        </div>
        <Button onClick={() => setShowAddBudget(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <ApperIcon name="PieChart" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 text-warning">
              <ApperIcon name="CreditCard" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBudget - totalSpent)}
              </p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  budgetUtilization >= 90 ? 'text-error' : 
                  budgetUtilization >= 75 ? 'text-warning' : 'text-success'
                }`}>
                  {budgetUtilization.toFixed(1)}% used
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10 text-success">
              <ApperIcon name="PiggyBank" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Categories */}
      {budgets.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <ApperIcon name="PieChart" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budget categories</h3>
            <p className="text-gray-500 mb-4">Create your first budget category to start tracking spending</p>
            <Button onClick={() => setShowAddBudget(true)}>
              Create Budget Category
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => (
            <BudgetCategory 
              key={budget.category} 
              budget={budget} 
              index={index}
            />
          ))}
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Budget Category</h3>
              <button
                onClick={() => setShowAddBudget(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="space-y-4">
              <Input
                label="Category Name" 
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                placeholder="e.g., Transportation"
                required
              />
              
              <Input
                label="Budget Limit"
                type="number"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddBudget(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Budget
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Budget