export interface System {
  address: number
  name: string
  position: { x: number; y: number; z: number }
  state: string
  power: string
}

export interface Market {
  market_id: number
  system_address: number
  market_name: string
  system_name: string
  landing_pad: string
  distance: number
  power_state?: string
  power?: string
}

export interface MarketResult2 {
  markets: Market[]
}

export interface MarketResult {
  result: MarketResult2
}
