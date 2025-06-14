import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import BudgetCategory from '@/components/molecules/BudgetCategory'
import ApperIcon from '@/components/ApperIcon'
import { budgetService } from '@/services'
import { toast } from 'react-toastify'

const BudgetOverview = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBudgets = async () => {
      setLoading(true)
      setError(null)
      try {
        const budgetData = await budgetService.getAll()
        setBudgets(budgetData)
      } catch (err) {
        setError(err.message || 'Failed to load budgets')
        toast.error('Failed to load budget overview')
      } finally {
        setLoading(false)
      }
    }

    loadBudgets()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
        </div>
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
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error mb-4">Error loading budgets: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="PieChart" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set up</h3>
          <p className="text-gray-500 mb-4">Create your first budget to start tracking spending</p>
          <Button>Create Budget</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
        <Button variant="outline" size="sm">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => (
          <BudgetCategory 
            key={budget.category} 
            budget={budget} 
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default BudgetOverview