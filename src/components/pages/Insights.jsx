import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { transactionService, budgetService, goalService } from '@/services'
import { toast } from 'react-toastify'

const Insights = () => {
  const [insights, setInsights] = useState([])
  const [spendingTrends, setSpendingTrends] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock data for spending trends chart
  const spendingChart = {
    series: [{
      name: 'Spending',
      data: [2100, 1980, 2350, 2200, 1850, 2400]
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ['#4A90E2'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['July', 'August', 'September', 'October', 'November', 'December']
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  }

  // Mock data for category comparison
  const categoryChart = {
    series: [{
      name: 'This Month',
      data: [285, 180, 95, 69, 226, 125]
    }, {
      name: 'Last Month',
      data: [320, 210, 110, 85, 180, 140]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      colors: ['#00D4AA', '#FFA726'],
      xaxis: {
        categories: ['Groceries', 'Dining', 'Gas', 'Entertainment', 'Shopping', 'Health']
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value}`
        }
      }
    }
  }

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true)
      setError(null)
      try {
        const [transactions, budgets, goals] = await Promise.all([
          transactionService.getAll(),
          budgetService.getAll(),
          goalService.getAll()
        ])

        // Generate insights based on data
        const generatedInsights = generateInsights(transactions, budgets, goals)
        setInsights(generatedInsights)
      } catch (err) {
        setError(err.message || 'Failed to load insights')
        toast.error('Failed to load insights')
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [])

  const generateInsights = (transactions, budgets, goals) => {
    const insights = []

    // Spending pattern insights
    const monthlySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    insights.push({
      id: 1,
      type: 'spending',
      title: 'Spending Pattern Analysis',
      description: `You've spent $${monthlySpending.toLocaleString()} this month. This is 15% less than last month, showing good spending control.`,
      priority: 'medium',
      actionable: true,
      icon: 'TrendingDown',
      color: 'success'
    })

    // Budget performance
    const budgetUsage = budgets.map(b => (b.spent / b.limit) * 100)
    const averageUsage = budgetUsage.reduce((sum, usage) => sum + usage, 0) / budgetUsage.length

    insights.push({
      id: 2,
      type: 'budget',
      title: 'Budget Performance',
      description: `Your average budget utilization is ${averageUsage.toFixed(1)}%. You're doing well staying within limits across categories.`,
      priority: 'low',
      actionable: false,
      icon: 'PieChart',
      color: 'primary'
    })

    // Goal progress
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount)
    if (activeGoals.length > 0) {
      const avgProgress = activeGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / activeGoals.length * 100

      insights.push({
        id: 3,
        type: 'goals',
        title: 'Goal Progress Update',
        description: `You're ${avgProgress.toFixed(1)}% of the way to completing your active goals. Keep up the momentum!`,
        priority: 'medium',
        actionable: true,
        icon: 'Target',
        color: 'accent'
      })
    }

    // Savings opportunity
    insights.push({
      id: 4,
      type: 'savings',
      title: 'Savings Opportunity',
      description: 'You could save an estimated $150/month by reducing dining out expenses by 25%. Consider meal planning to boost savings.',
      priority: 'high',
      actionable: true,
      icon: 'PiggyBank',
      color: 'warning'
    })

    // Investment insight
    insights.push({
      id: 5,
      type: 'investment',
      title: 'Investment Rebalancing',
      description: 'Your portfolio has drifted from target allocation. Consider rebalancing to maintain your risk profile.',
      priority: 'medium',
      actionable: true,
      icon: 'BarChart3',
      color: 'secondary'
    })

    return insights
  }

  const getInsightIcon = (type) => {
    const iconMap = {
      'spending': 'CreditCard',
      'budget': 'PieChart',
      'goals': 'Target',
      'savings': 'PiggyBank',
      'investment': 'TrendingUp'
    }
    return iconMap[type] || 'Lightbulb'
  }

  const getPriorityColor = (priority) => {
    const colorMap = {
      'high': 'error',
      'medium': 'warning',
      'low': 'info'
    }
    return colorMap[priority] || 'default'
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Insights</h1>
          <p className="text-gray-600">Personalized recommendations and financial analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <p className="text-error mb-4">Error loading insights: {error}</p>
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
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Insights</h1>
          <p className="text-gray-600">Personalized recommendations and financial analysis</p>
        </div>
        <Button>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trends</h3>
          <Chart
            options={spendingChart.options}
            series={spendingChart.series}
            type="line"
            height={300}
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
          <Chart
            options={categoryChart.options}
            series={categoryChart.series}
            type="bar"
            height={300}
          />
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h2>
        
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${insight.color}/10 text-${insight.color}`}>
                  <ApperIcon name={insight.icon} size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <Badge variant={getPriorityColor(insight.priority)} size="sm">
                      {insight.priority} priority
                    </Badge>
                    {insight.actionable && (
                      <Badge variant="accent" size="sm">
                        <ApperIcon name="Zap" size={12} className="mr-1" />
                        Actionable
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 break-words mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                      <Button size="sm">
                        Take Action
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Financial Health Score */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Score</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-success">78</p>
            <p className="text-sm text-gray-500">Good Financial Health</p>
          </div>
          <div className="w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#00C853"
                strokeWidth="3"
                strokeDasharray="78, 100"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Budget Management</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-sm font-medium">85%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Savings Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-sm font-medium">65%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Debt Management</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <span className="text-sm font-medium">90%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Investment Diversification</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <span className="text-sm font-medium">72%</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Insights