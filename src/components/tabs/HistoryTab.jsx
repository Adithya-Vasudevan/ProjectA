import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { useStoreSelectors } from '../../stores/appStore'

const HistoryTab = () => {
  const { snapshots } = useStoreSelectors()
  const [selectedSnapshot, setSelectedSnapshot] = useState(null)

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatTimeShort = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const calculateTrend = (current, previous) => {
    if (!previous) return null
    const change = current - previous
    const percent = previous > 0 ? (change / previous) * 100 : 0
    return { change, percent }
  }

  const getMetricTrend = (index, metric) => {
    if (index >= snapshots.length - 1) return null
    const current = snapshots[index].metrics[metric]
    const previous = snapshots[index + 1].metrics[metric]
    return calculateTrend(current, previous)
  }

  const TrendIndicator = ({ trend, suffix = '' }) => {
    if (!trend) return <span className="text-gray-400">-</span>
    
    const isPositive = trend.change > 0
    const color = isPositive ? 'text-green-500' : trend.change < 0 ? 'text-red-500' : 'text-gray-400'
    const icon = isPositive ? '↗' : trend.change < 0 ? '↘' : '→'
    
    return (
      <span className={`text-xs ${color}`}>
        {icon} {Math.abs(trend.change)}{suffix} ({Math.abs(trend.percent).toFixed(1)}%)
      </span>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data History
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Historical snapshots of system performance (last {snapshots.length} updates)
        </p>
      </motion.div>

      {snapshots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No History Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Data snapshots will appear here as the system collects information over time.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Recent Snapshots Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Recent Updates Timeline
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {snapshots.slice(0, 10).map((snapshot, index) => (
                <motion.div
                  key={snapshot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedSnapshot(snapshot)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-citi-blue text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatTime(snapshot.timestamp)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {snapshot.metrics.totalBikes} bikes • {snapshot.metrics.totalDocks} docks
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {snapshot.metrics.utilization.toFixed(1)}% utilized
                    </div>
                    <div className="text-xs">
                      <TrendIndicator trend={getMetricTrend(index, 'utilization')} suffix="%" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Historical Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {snapshots.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
                >
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Peak Bikes Available
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    <CountUp end={Math.max(...snapshots.map(s => s.metrics.totalBikes))} duration={1.5} />
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Highest recorded
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
                >
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                    Peak Utilization
                  </h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    <CountUp 
                      end={Math.max(...snapshots.map(s => s.metrics.utilization))} 
                      duration={1.5} 
                      decimals={1}
                      suffix="%"
                    />
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Maximum efficiency
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
                >
                  <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Most Active Stations
                  </h4>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    <CountUp end={Math.max(...snapshots.map(s => s.metrics.activeStations))} duration={1.5} />
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    Peak activity
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800"
                >
                  <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">
                    Data Collection
                  </h4>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    <CountUp end={snapshots.length} duration={1.5} />
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    Snapshots stored
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Snapshot Detail Modal */}
      <AnimatePresence>
        {selectedSnapshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSnapshot(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Snapshot Details
                </h3>
                <button
                  onClick={() => setSelectedSnapshot(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Timestamp */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Timestamp</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatTime(selectedSnapshot.timestamp)}
                  </p>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">System Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Stations</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedSnapshot.metrics.totalStations}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Active Stations</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {selectedSnapshot.metrics.activeStations}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Bikes</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {selectedSnapshot.metrics.totalBikes}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Docks</div>
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {selectedSnapshot.metrics.totalDocks}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilization */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">System Utilization</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Utilization Rate</span>
                      <span className="font-bold text-citi-blue">
                        {selectedSnapshot.metrics.utilization.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-citi-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${selectedSnapshot.metrics.utilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HistoryTab