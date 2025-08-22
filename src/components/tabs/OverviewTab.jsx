import React from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useStoreSelectors } from '../../stores/appStore'

const OverviewTab = () => {
  const {
    totalStations,
    availableBikes,
    availableDocks,
    activeStations,
    enrichedStations
  } = useStoreSelectors()

  // Calculate utilization rate
  const totalCapacity = availableBikes + availableDocks
  const utilizationRate = totalCapacity > 0 ? (availableBikes / totalCapacity) * 100 : 0

  // Get top stations by activity
  const topStations = enrichedStations
    .filter(station => station.name && (station.num_bikes_available || 0) > 0)
    .sort((a, b) => (b.num_bikes_available || 0) - (a.num_bikes_available || 0))
    .slice(0, 10)

  const stats = [
    {
      title: 'Total Stations',
      value: totalStations,
      icon: '🚉',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Active Stations',
      value: activeStations,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Available Bikes',
      value: availableBikes,
      icon: '🚴',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Available Docks',
      value: availableDocks,
      icon: '🅿️',
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to RidePulse NYC
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Real-time insights into New York City's Citi Bike sharing system. 
          Track availability, monitor trends, and explore the pulse of urban mobility.
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className={`text-right`}>
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  <CountUp end={stat.value} duration={2} />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {stat.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Utilization Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Utilization
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Bikes Available</span>
              <span>{utilizationRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${utilizationRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-citi-blue to-blue-600 h-4 rounded-full"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-citi-blue">
              <CountUp end={utilizationRate} duration={2} decimals={1} suffix="%" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Stations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Most Active Stations
        </h3>
        <div className="space-y-4">
          {topStations.slice(0, 5).map((station, index) => (
            <motion.div
              key={station.station_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-citi-blue text-white rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {station.name || `Station ${station.station_id}`}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {station.num_docks_available || 0} docks available
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {station.num_bikes_available || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">bikes</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-sm font-medium">System Operating Normally</span>
        </div>
      </motion.div>
    </div>
  )
}

export default OverviewTab