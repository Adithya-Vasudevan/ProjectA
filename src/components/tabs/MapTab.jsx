import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import L from 'leaflet'
import { useStoreSelectors } from '../../stores/appStore'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for different station states
const createCustomIcon = (color, count) => {
  return L.divIcon({
    html: `<div class="custom-marker" style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

const MapTab = () => {
  const { enrichedStations } = useStoreSelectors()

  // NYC center coordinates
  const nycCenter = [40.7589, -73.9851]

  // Filter and process stations for map display
  const mapStations = useMemo(() => {
    return enrichedStations
      .filter(station => 
        station.lat && 
        station.lon && 
        station.name &&
        station.lat !== 0 && 
        station.lon !== 0
      )
      .map(station => {
        const bikes = station.num_bikes_available || 0
        const docks = station.num_docks_available || 0
        const isActive = station.is_renting === 1 && station.is_returning === 1
        
        let color = '#64748b' // Gray for inactive
        if (isActive) {
          if (bikes === 0) color = '#ef4444' // Red for empty
          else if (bikes < 5) color = '#f59e0b' // Orange for low
          else color = '#10b981' // Green for good availability
        }
        
        return {
          ...station,
          color,
          bikes,
          docks,
          isActive,
          utilization: bikes + docks > 0 ? (bikes / (bikes + docks)) * 100 : 0
        }
      })
  }, [enrichedStations])

  const stats = useMemo(() => {
    const total = mapStations.length
    const active = mapStations.filter(s => s.isActive).length
    const empty = mapStations.filter(s => s.bikes === 0).length
    const low = mapStations.filter(s => s.bikes > 0 && s.bikes < 5).length
    
    return { total, active, empty, low }
  }, [mapStations])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Station Map
        </h2>
        
        {/* Map Legend */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Good Availability (5+ bikes)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Low Availability (1-4 bikes)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Empty Station</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Inactive Station</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-citi-blue">{stats.total}</strong> total stations
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-green-600">{stats.active}</strong> active
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-red-600">{stats.empty}</strong> empty
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-orange-600">{stats.low}</strong> low availability
          </span>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1"
      >
        <MapContainer
          center={nycCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {mapStations.map((station) => (
            <Marker
              key={station.station_id}
              position={[station.lat, station.lon]}
              icon={createCustomIcon(station.color, station.bikes)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {station.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${station.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Bikes:</span>
                      <span className="font-medium text-blue-600">{station.bikes}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Docks:</span>
                      <span className="font-medium text-orange-600">{station.docks}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{station.bikes + station.docks}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-medium">{station.utilization.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Utilization bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Empty</span>
                      <span>Full</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${station.utilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>
    </div>
  )
}

export default MapTab