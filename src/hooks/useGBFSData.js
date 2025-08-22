import { useEffect, useRef } from 'react'
import useAppStore from '../stores/appStore'
import gbfsService from '../services/gbfsService'

export const useGBFSData = () => {
  const {
    setStations,
    setStationStatus,
    setLoading,
    setError,
    setLastUpdate,
    addSnapshot
  } = useAppStore()

  const intervalRef = useRef(null)
  const isInitialLoad = useRef(true)

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      setError(null)

      const { stations, status, timestamp } = await gbfsService.fetchAllData()
      
      setStations(stations)
      setStationStatus(status)
      setLastUpdate(timestamp)

      // Create and store snapshot
      const snapshot = gbfsService.createSnapshot(stations, status)
      addSnapshot(snapshot)

      console.log(`Data updated: ${stations.length} stations, ${status.length} status records`)
      
    } catch (error) {
      console.error('Failed to fetch GBFS data:', error)
      setError(error.message)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const startAutoRefresh = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up 30-second refresh interval
    intervalRef.current = setInterval(() => {
      fetchData(false) // Don't show loading spinner for background updates
    }, 30000)
  }

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    // Initial data load
    fetchData(true)
    
    // Start auto-refresh
    startAutoRefresh()

    // Cleanup on unmount
    return () => {
      stopAutoRefresh()
    }
  }, [])

  return {
    fetchData,
    startAutoRefresh,
    stopAutoRefresh
  }
}