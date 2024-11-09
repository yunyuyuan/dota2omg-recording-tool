import { CloseSharp } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useStore } from "~/utils/store";
import { type Hero } from "~/utils/type";

const Row = ({ hero, search }: { hero: Hero, search: string }) => {
  const { currentChoose, updateItemRow } = useStore();

  const heroMatch = [hero.name, hero.nameCN, hero.nameEN].some(i => i.includes(search));
  const abilitiesMatch = hero.abilities.filter(i => [i.name, i.nameCN].some(j => j.includes(search))).map(i => i.name);

  return (
    (heroMatch || abilitiesMatch.length > 0) && currentChoose ? (
      <div className="flex items-center gap-1">
        <Tooltip title={hero.name}>
          <img
            className="h-20"
            style={{
              cursor: currentChoose.abilityIndex < 0 ? 'pointer' : 'not-allowed',
              filter: `grayscale(${heroMatch ? 0 : 1})`
            }}
            src={`/data-images/${hero.name}.png`} alt="hero"
            onClick={() => currentChoose.abilityIndex < 0 && updateItemRow(hero)}
          />
        </Tooltip>
        {
          hero.abilities.map(ability => (
            <Tooltip key={ability.name} title={ability.name}>
              <img
                className="h-16"
                style={{
                  cursor: currentChoose.abilityIndex >= 0 ? 'pointer' : 'not-allowed',
                  filter: `grayscale(${abilitiesMatch.includes(ability.name) ? 0 : 1})`
                }}
                src={`/data-images/${ability.name}.png`}
                alt="ability"
                onClick={() => currentChoose.abilityIndex >= 0 && updateItemRow(ability)}
              />
            </Tooltip>
          ))
        }
      </div>
    ) : null
  )
}

const ChooseDialog = () => {
  const { heroList, currentChoose, setCurrentChoose } = useStore();

  const [search, setSearch] = useState('');

  const onClose = () => setCurrentChoose(null);

  return (
    <Dialog
      open={!!currentChoose}
      fullWidth
      maxWidth={false}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        选择
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseSharp />
      </IconButton>
      <DialogContent>
        <div className="mb-5 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索"
            className="w-64 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-wrap gap-12">
          {
            heroList.map(hero => (
              <Row key={hero.id} hero={hero} search={search} />
            ))
          }
        </div>
      </DialogContent>
      <div className="flex justify-center my-3">
        <Button size="large" onClick={onClose}>取消</Button>
      </div>
    </Dialog>
  )
}

export default ChooseDialog;