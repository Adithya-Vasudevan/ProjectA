import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore, { useStoreSelectors } from '../stores/appStore'
import OverviewTab from './tabs/OverviewTab'
import MapTab from './tabs/MapTab'
import ChartsTab from './tabs/ChartsTab'
import HistoryTab from './tabs/HistoryTab'

const Dashboard = () => {
  const { activeTab } = useStoreSelectors()

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'map':
        return <MapTab />
      case 'charts':
        return <ChartsTab />
      case 'history':
        return <HistoryTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="h-full overflow-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="h-full"
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Dashboard