import React from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useStoreSelectors } from '../stores/appStore'

const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    setSidebarOpen,
    totalStations,
    availableBikes,
    availableDocks,
    activeStations,
    lastUpdate,
    snapshots
  } = useStoreSelectors()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Station Map', icon: '🗺️' },
    { id: 'charts', label: 'Analytics', icon: '📈' },
    { id: 'history', label: 'History', icon: '🕒' }
  ]

  const stats = [
    { 
      label: 'Total Stations', 
      value: totalStations, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'Active Stations', 
      value: activeStations, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: 'Available Bikes', 
      value: availableBikes, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      label: 'Available Docks', 
      value: availableDocks, 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Dashboard
          </motion.h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Last Update */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-gray-500 dark:text-gray-400 mb-4"
        >
          Last updated: {formatTime(lastUpdate)}
        </motion.div>

        {/* Live indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-2 text-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-gray-600 dark:text-gray-300">Live Data</span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
          Quick Stats
        </h3>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`${stat.bgColor} rounded-lg p-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </span>
                <span className={`text-lg font-bold ${stat.color}`}>
                  <CountUp end={stat.value} duration={1.5} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
          Views
        </h3>
        <nav className="space-y-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-citi-blue text-white shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Snapshots Info */}
      <div className="p-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
          Data History
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Snapshots stored
            </span>
            <span className="text-lg font-bold text-citi-blue">
              {snapshots.length}/20
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(snapshots.length / 20) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-citi-blue h-2 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Auto-refresh every 30 seconds
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Sidebar