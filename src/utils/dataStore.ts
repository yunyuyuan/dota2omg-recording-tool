import { DefaultConfig, type Hero, type Ability, type Choose, type ItemRow } from '~/utils/type'
import { create } from 'zustand'
import axios from 'axios'

type State = {
  heroList: Hero[]
  abilityList: Ability[]
  itemRows: ItemRow[]
  currentChoose: Choose | null
}

type Actions = {
  initHeroList: () => void
  initItemRows: (rows: ItemRow[]) => void
  setCurrentChoose: (choose: Choose | null) => void
  updateItemRow: (v: Hero | Ability) => void
  swapItemRow: (indexes1: number[], indexes2: number[]) => void
}

const STORAGE_KEY = 'dota2omg-recording-tool-item-rows'

export const useDataStore = create<State & Actions>()((set, get) => ({
  config: DefaultConfig,
  heroList: [],
  abilityList: [],
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
          abilityList: data.reduce((acc, hero) => acc.concat(hero.abilities), [] as Ability[]),
          itemRows
        })
      }
    })
  },
  initItemRows: (rows) => {
    set({ itemRows: rows })
  },
  setCurrentChoose: (currentChoose) => {
    set({ currentChoose })
  },
  swapItemRow: (indexes1, indexes2) => {
    let itemRows = get().itemRows
    if (indexes1.length === 1) {
      // Hero
      const hero1 = itemRows[indexes1[0]!]!.hero
      const hero2 = itemRows[indexes2[0]!]!.hero
      itemRows = itemRows.map((i, index) => {
        if (index === indexes1[0]) {
          return {
            hero: hero2,
            abilities: i.abilities
          }
        } else if (index === indexes2[0]) {
          return {
            hero: hero1,
            abilities: i.abilities
          }
        }
        return i
      })
    } else {
      // Ability
      const rowIndex1 = indexes1[0]!
      const rowIndex2 = indexes2[0]!
      const ability1 = itemRows[rowIndex1]!.abilities[indexes1[1]!]!
      const ability2 = itemRows[rowIndex2]!.abilities[indexes2[1]!]!
      itemRows = itemRows.map((i, index) => {
        return {
          hero: i.hero,
          abilities: i.abilities.map((i, index2) => {
            if (index === rowIndex1 && index2 === indexes1[1]) {
              return ability2
            } else if (index === rowIndex2 && index2 === indexes2[1]) {
              return ability1
            }
            return i
          })
        }
      })
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemRows))
    set({ itemRows })
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
      }
      return {}
    })
  },
}))