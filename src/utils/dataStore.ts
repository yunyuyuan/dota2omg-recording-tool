import { DefaultConfig, type Hero, type Ability, type Choose, type ItemRow } from '~/utils/type'
import { create } from 'zustand'
import axios from 'axios'

type State = {
  heroList: Hero[]
  itemRows: ItemRow[]
  currentChoose: Choose | null
}

type Actions = {
  initHeroList: () => void
  setCurrentChoose: (choose: Choose | null) => void
  updateItemRow: (v: Hero | Ability) => void
}

const STORAGE_KEY = 'dota2omg-recording-tool-item-rows'

export const useDataStore = create<State & Actions>()((set, get) => ({
  config: DefaultConfig,
  heroList: [],
  itemRows: [],
  currentChoose: null,
  initHeroList: () => {
    void axios.get('/data.json').then((res) => {
      if (res.status === 200) {
        const data = res.data as Hero[]
        let itemRows = data.slice(0, 5).map(hero => ({
          hero: hero,
          abilities: hero.abilities.slice(0, 4)
        }))
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            try {
              itemRows = JSON.parse(stored) as { hero: Hero, abilities: Ability[] }[]
            } catch {}
          }
        }
        set({
          heroList: data,
          itemRows
        })
      }
    })
  },
  setCurrentChoose: (currentChoose) => {
    set({ currentChoose })
  },
  updateItemRow: (v) => {
    const currentChoose = get().currentChoose
    set(state => {
      if (currentChoose) {
        const itemRows = state.itemRows.map((i, index1) => {
          if (index1 === currentChoose.heroIndex) {
            if (currentChoose.abilityIndex === -1) {
              return {
                hero: v as Hero,
                abilities: i.abilities
              }
            } else {
              return {
                hero: i.hero,
                abilities: i.abilities.map((i, index2) => index2 === currentChoose.abilityIndex ? v as Ability : i)
              }
            }
          }
          return i
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(itemRows))
        return { itemRows, currentChoose: null }
      } else {
        return { currentChoose: null }
      }
    })
  },
}))