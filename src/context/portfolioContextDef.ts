import { createContext } from 'react'
import type { PortfolioState } from '../types/portfolio'

export interface PortfolioContextType {
  data: PortfolioState
  updateData: (updater: (prev: PortfolioState) => PortfolioState) => void
  resetToDefaults: () => void
  isAdminOpen: boolean
  setIsAdminOpen: (open: boolean) => void
  hasCustomEdits: boolean
  generateTypeScriptSource: () => string
}

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

