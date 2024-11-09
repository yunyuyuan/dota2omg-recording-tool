import { DefaultConfig, type Hero, type Config, type Ability, type Choose } from '~/utils/type'
import { create } from 'zustand'
import axios from 'axios'

type State = {
  config: Config
  heroList: Hero[]
  itemRows: {hero: Hero, abilities: Ability[]}[]
  currentChoose: Choose | null
}

type Actions = {
  updateConfig: (config: Config) => void
  initHeroList: () => void
  setCurrentChoose: (choose: Choose | null) => void
  updateItemRow: (v: Hero | Ability) => void
}

export const useStore = create<State & Actions>()((set, get) => ({
  config: DefaultConfig,
  heroList: [],
  itemRows: [],
  currentChoose: null,
  initHeroList: () => {
    void axios.get('/data.json').then((res) => {
      if (res.status === 200) {
        const data = res.data as Hero[]
        set({
          heroList: data,
          itemRows: data.slice(0, 5).map(hero => ({
            hero: hero,
            abilities: hero.abilities.slice(0, 4)
          }))
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
        return { itemRows, currentChoose: null }
      } else {
        return { currentChoose: null }
      }
    })
  },
  updateConfig: (config) => {
    set({ config })
  },
}))