import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // UI State
      sidebarOpen: true,
      activeTab: 'overview',
      theme: 'dark',
      
      // Data State
      stations: [],
      stationStatus: [],
      snapshots: [],
      lastUpdate: null,
      isLoading: false,
      error: null,

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTheme: (theme) => set({ theme }),
      
      setStations: (stations) => set({ stations }),
      setStationStatus: (status) => set({ stationStatus: status }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setLastUpdate: (time) => set({ lastUpdate: time }),

      // Snapshot management - keep last 20 snapshots
      addSnapshot: (snapshot) => {
        const currentSnapshots = get().snapshots
        const newSnapshots = [snapshot, ...currentSnapshots].slice(0, 20)
        set({ snapshots: newSnapshots })
      }
    }),
    {
      name: 'ridepulse-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        snapshots: state.snapshots,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        activeTab: state.activeTab
      })
    }
  )
)

// Computed selectors
export const useStoreSelectors = () => {
  const state = useAppStore()
  
  return {
    ...state,
    totalStations: state.stations.length,
    availableBikes: state.stationStatus.reduce((sum, station) => sum + (station.num_bikes_available || 0), 0),
    availableDocks: state.stationStatus.reduce((sum, station) => sum + (station.num_docks_available || 0), 0),
    activeStations: state.stationStatus.filter(station => station.is_renting === 1 && station.is_returning === 1).length,
    enrichedStations: state.stations.map(station => {
      const stationStatus = state.stationStatus.find(s => s.station_id === station.station_id)
      return {
        ...station,
        ...stationStatus
      }
    })
  }
}

export default useAppStore