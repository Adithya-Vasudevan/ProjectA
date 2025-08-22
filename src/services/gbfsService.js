import { mockStationInformation, mockStationStatus } from '../utils/mockData.js'

// Citi Bike GBFS API endpoints
const GBFS_BASE_URL = 'https://gbfs.citibikenyc.com/gbfs/2.3/gbfs.json'
const STATION_INFORMATION_URL = 'https://gbfs.citibikenyc.com/gbfs/2.3/en/station_information.json'
const STATION_STATUS_URL = 'https://gbfs.citibikenyc.com/gbfs/2.3/en/station_status.json'

class GBFSService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 30000 // 30 seconds
  }

  async fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  }

  isDataFresh(key) {
    const cacheEntry = this.cache.get(key)
    if (!cacheEntry) return false
    
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout
  }

  getCachedData(key) {
    const cacheEntry = this.cache.get(key)
    return cacheEntry ? cacheEntry.data : null
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  async fetchStationInformation() {
    const cacheKey = 'station_information'
    
    if (this.isDataFresh(cacheKey)) {
      return this.getCachedData(cacheKey)
    }

    try {
      const response = await this.fetchWithTimeout(STATION_INFORMATION_URL)
      const stations = response.data?.stations || []
      
      this.setCachedData(cacheKey, stations)
      return stations
    } catch (error) {
      console.error('Error fetching station information:', error)
      
      // Return cached data if available, even if stale
      const cachedData = this.getCachedData(cacheKey)
      if (cachedData) {
        console.warn('Using stale station information data')
        return cachedData
      }
      
      // Fallback to mock data for development/demo
      console.warn('Using mock station information data')
      this.setCachedData(cacheKey, mockStationInformation)
      return mockStationInformation
    }
  }

  async fetchStationStatus() {
    const cacheKey = 'station_status'
    
    if (this.isDataFresh(cacheKey)) {
      return this.getCachedData(cacheKey)
    }

    try {
      const response = await this.fetchWithTimeout(STATION_STATUS_URL)
      const status = response.data?.stations || []
      
      this.setCachedData(cacheKey, status)
      return status
    } catch (error) {
      console.error('Error fetching station status:', error)
      
      // Return cached data if available, even if stale
      const cachedData = this.getCachedData(cacheKey)
      if (cachedData) {
        console.warn('Using stale station status data')
        return cachedData
      }
      
      // Fallback to mock data for development/demo
      console.warn('Using mock station status data')
      this.setCachedData(cacheKey, mockStationStatus)
      return mockStationStatus
    }
  }

  async fetchAllData() {
    try {
      const [stations, status] = await Promise.all([
        this.fetchStationInformation(),
        this.fetchStationStatus()
      ])

      return {
        stations,
        status,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error fetching GBFS data:', error)
      throw error
    }
  }

  // Create a snapshot of current data for historical tracking
  createSnapshot(stations, status) {
    const timestamp = Date.now()
    
    // Calculate aggregate metrics
    const totalBikes = status.reduce((sum, s) => sum + (s.num_bikes_available || 0), 0)
    const totalDocks = status.reduce((sum, s) => sum + (s.num_docks_available || 0), 0)
    const activeStations = status.filter(s => s.is_renting === 1 && s.is_returning === 1).length
    
    return {
      id: timestamp,
      timestamp,
      metrics: {
        totalStations: stations.length,
        activeStations,
        totalBikes,
        totalDocks,
        utilization: totalBikes / (totalBikes + totalDocks) * 100
      },
      // Store a sample of station data for trends
      stationSample: status.slice(0, 50).map(s => ({
        station_id: s.station_id,
        bikes: s.num_bikes_available || 0,
        docks: s.num_docks_available || 0,
        is_active: s.is_renting === 1 && s.is_returning === 1
      }))
    }
  }
}

export default new GBFSService()