import { useContext } from 'react'
import { PortfolioContext } from './portfolioContextDef'
import type { PortfolioContextType } from './portfolioContextDef'

export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

