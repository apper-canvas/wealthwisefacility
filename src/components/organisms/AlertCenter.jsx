import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import AlertItem from '@/components/molecules/AlertItem'
import ApperIcon from '@/components/ApperIcon'
import { alertService } from '@/services'
import { toast } from 'react-toastify'

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true)
      setError(null)
      try {
        const alertData = await alertService.getAll()
        // Show top 5 alerts
        setAlerts(alertData.slice(0, 5))
      } catch (err) {
        setError(err.message || 'Failed to load alerts')
        toast.error('Failed to load alerts')
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [])

  const handleMarkAsRead = async (alertId) => {
    try {
      await alertService.markAsRead(alertId)
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ))
      toast.success('Alert marked as read')
    } catch (err) {
      toast.error('Failed to mark alert as read')
    }
  }

  const handleDeleteAlert = async (alertId) => {
    try {
      await alertService.delete(alertId)
      setAlerts(alerts.filter(alert => alert.id !== alertId))
      toast.success('Alert deleted')
    } catch (err) {
      toast.error('Failed to delete alert')
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Smart Alerts</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex space-x-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error mb-4">Error loading alerts: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="Bell" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
          <p className="text-gray-500">You're all caught up! We'll notify you of important updates.</p>
        </div>
      </Card>
    )
  }

  const unreadCount = alerts.filter(alert => !alert.read).length

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Smart Alerts</h2>
          {unreadCount > 0 && (
            <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm">
          <ApperIcon name="Settings" size={16} className="mr-2" />
          Settings
        </Button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert, index) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            index={index}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteAlert}
          />
        ))}
      </div>
    </Card>
  )
}

export default AlertCenter