import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import MetricCard from '@/components/molecules/MetricCard'
import ApperIcon from '@/components/ApperIcon'
import { accountService } from '@/services'
import { toast } from 'react-toastify'

const Investments = () => {
  const [investments, setInvestments] = useState([])
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mock portfolio data for demonstration
  const portfolioAllocation = {
    series: [40, 25, 20, 15],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Stocks', 'Bonds', 'Real Estate', 'Cash'],
      colors: ['#1E3A5F', '#4A90E2', '#00D4AA', '#FFA726'],
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%'
          }
        }
      }
    }
  }

  const performanceChart = {
    series: [{
      name: 'Portfolio Value',
      data: [45000, 46200, 47800, 46500, 48200, 49100, 50800, 52300, 51200, 53400, 54800, 55600]
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ['#00D4AA'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${(value / 1000).toFixed(0)}K`
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  }

  useEffect(() => {
    const loadInvestments = async () => {
      setLoading(true)
      setError(null)
      try {
        const accounts = await accountService.getAll()
        const investmentAccounts = accounts.filter(account => account.type === 'investment')
        setInvestments(investmentAccounts)
        
        const totalValue = investmentAccounts.reduce((sum, account) => sum + account.balance, 0)
        setPortfolioValue(totalValue)
      } catch (err) {
        setError(err.message || 'Failed to load investments')
        toast.error('Failed to load investment data')
      } finally {
        setLoading(false)
      }
    }

    loadInvestments()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Investments</h1>
          <p className="text-gray-600">Monitor your investment portfolio and performance</p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
          <Card className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
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
        <p className="text-error mb-4">Error loading investments: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    )
  }

  if (investments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ApperIcon name="TrendingUp" size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No investment accounts</h3>
        <p className="text-gray-500 mb-4">Connect your investment accounts to track portfolio performance</p>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Connect Investment Account
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
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Investments</h1>
          <p className="text-gray-600">Monitor your investment portfolio and performance</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Investment
        </Button>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(portfolioValue)}
          change="+8.2%"
          changeType="positive"
          icon="TrendingUp"
          color="primary"
        />
        
        <MetricCard
          title="Total Gain/Loss"
          value="+$8,420"
          change="+12.5%"
          changeType="positive"
          icon="DollarSign"
          color="success"
        />
        
        <MetricCard
          title="Annual Return"
          value="11.8%"
          change="+2.1%"
          changeType="positive"
          icon="BarChart3"
          color="secondary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
          <Chart
            options={performanceChart.options}
            series={performanceChart.series}
            type="area"
            height={300}
          />
        </Card>

        {/* Asset Allocation */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <Chart
            options={portfolioAllocation.options}
            series={portfolioAllocation.series}
            type="donut"
            height={300}
          />
        </Card>
      </div>

      {/* Investment Accounts */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Accounts</h3>
        <div className="space-y-4">
          {investments.map((investment, index) => (
            <motion.div
              key={investment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                  <ApperIcon name="TrendingUp" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{investment.name}</h4>
                  <p className="text-sm text-gray-500">Investment Account</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(investment.balance)}
                </p>
                <p className="text-sm text-success">+5.2% this month</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Investment Recommendations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-info/10 rounded-lg">
            <ApperIcon name="Lightbulb" size={20} className="text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Rebalancing Recommendation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your portfolio is overweight in stocks (40% vs target 35%). Consider rebalancing to maintain your target allocation.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-success/10 rounded-lg">
            <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Diversification Good</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your portfolio shows good diversification across asset classes, helping to manage risk.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-warning/10 rounded-lg">
            <ApperIcon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Tax Optimization</h4>
              <p className="text-sm text-gray-600 mt-1">
                Consider increasing contributions to tax-advantaged accounts to optimize your tax strategy.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Investments