import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 sm:h-20 bg-white border-b border-gray-200 px-4 sm:px-4 lg:px-6 xl:px-8 z-40">
        <div className="flex items-center justify-between h-full max-w-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={16} className="text-white sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-heading font-bold text-primary">WealthWise</h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface border-r border-gray-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {routeArray.map(route => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name="DollarSign" size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-heading font-bold text-primary">WealthWise</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                    aria-label="Close menu"
                  >
                    <ApperIcon name="X" size={22} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {routeArray.map(route => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 touch-manipulation ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={22} />
                      <span className="font-medium text-base">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <nav className="flex">
          {routeArray.slice(0, 4).map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 px-2 transition-all duration-200 touch-manipulation ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900 active:bg-gray-50'
                }`
              }
            >
              <div className={`p-1 rounded-lg transition-colors ${
                location.pathname === route.path ? 'bg-primary/10' : ''
              }`}>
                <ApperIcon name={route.icon} size={22} />
              </div>
              <span className="text-xs mt-1 font-medium leading-tight">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Layout