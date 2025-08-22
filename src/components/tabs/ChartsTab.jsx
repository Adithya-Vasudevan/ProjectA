import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { useStoreSelectors } from '../../stores/appStore'

const ChartsTab = () => {
  const { snapshots, enrichedStations } = useStoreSelectors()

  // Prepare time series data from snapshots
  const timeSeriesData = useMemo(() => {
    return snapshots
      .slice()
      .reverse() // Most recent first
      .map(snapshot => ({
        time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: snapshot.timestamp,
        bikes: snapshot.metrics.totalBikes,
        docks: snapshot.metrics.totalDocks,
        utilization: snapshot.metrics.utilization,
        activeStations: snapshot.metrics.activeStations
      }))
  }, [snapshots])

  // Station distribution data
  const stationDistribution = useMemo(() => {
    const distribution = { empty: 0, low: 0, medium: 0, high: 0 }
    
    enrichedStations.forEach(station => {
      const bikes = station.num_bikes_available || 0
      if (bikes === 0) distribution.empty++
      else if (bikes <= 3) distribution.low++
      else if (bikes <= 8) distribution.medium++
      else distribution.high++
    })
    
    return [
      { name: 'Empty', value: distribution.empty, color: '#ef4444' },
      { name: 'Low (1-3)', value: distribution.low, color: '#f59e0b' },
      { name: 'Medium (4-8)', value: distribution.medium, color: '#3b82f6' },
      { name: 'High (9+)', value: distribution.high, color: '#10b981' }
    ]
  }, [enrichedStations])

  // Top stations by bikes
  const topStationsByBikes = useMemo(() => {
    return enrichedStations
      .filter(station => station.name && station.num_bikes_available)
      .sort((a, b) => (b.num_bikes_available || 0) - (a.num_bikes_available || 0))
      .slice(0, 10)
      .map(station => ({
        name: station.name.length > 25 ? station.name.substring(0, 25) + '...' : station.name,
        bikes: station.num_bikes_available || 0,
        docks: station.num_docks_available || 0
      }))
  }, [enrichedStations])

  // Utilization over time data
  const utilizationData = useMemo(() => {
    return timeSeriesData.map(item => ({
      time: item.time,
      utilization: item.utilization
    }))
  }, [timeSeriesData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name === 'utilization' && '%'}
            </p>
          ))}
        </div>
      )
    }
    return null
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
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into Citi Bike system performance and trends
        </p>
      </motion.div>

      {/* Time Series Charts */}
      {timeSeriesData.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bikes & Docks Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bikes & Docks Availability
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="bikes" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Available Bikes"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="docks" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Available Docks"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* System Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Utilization Rate
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Utilization Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Station Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Station Distribution by Bike Availability
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stationDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, `${name} stations`]}
                labelStyle={{ color: '#1f2937' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stationDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Stations Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Stations by Bike Availability
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStationsByBikes} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bikes" fill="#3b82f6" name="Available Bikes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Stats */}
      {timeSeriesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-citi-blue to-blue-600 rounded-xl p-6 text-white"
        >
          <h3 className="text-lg font-semibold mb-4">System Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {timeSeriesData[timeSeriesData.length - 1]?.utilization.toFixed(1) || 0}%
              </div>
              <div className="text-blue-100">Current Utilization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {enrichedStations.filter(s => (s.num_bikes_available || 0) > 5).length}
              </div>
              <div className="text-blue-100">Well-Stocked Stations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {snapshots.length}
              </div>
              <div className="text-blue-100">Data Points Collected</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChartsTab