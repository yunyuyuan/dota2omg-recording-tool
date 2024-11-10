import { DefaultConfig, type Config } from '~/utils/type'
import { create } from 'zustand'

type State = {
  config: Config
}

type Actions = {
  updateConfig: (k: string, v: number) => void
  initConfig: () => void
  resetConfig: () => void
}

const STORAGE_KEY = 'dota2omg-recording-tool-config'

export const useConfigStore = create<State & Actions>()((set) => ({
  config: DefaultConfig,
  initConfig: () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        set({ config: JSON.parse(stored) as Config })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  },
  resetConfig: () => {
    set({ config: DefaultConfig })
    localStorage.removeItem(STORAGE_KEY)
  },
  updateConfig: (k, v) => {
    set(state => {
      const newConfig = { ...state.config, [k]: v }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },
}))