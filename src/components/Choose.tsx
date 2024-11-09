import { CloseSharp } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDataStore } from "~/utils/dataStore";
import { type Hero } from "~/utils/type";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getImgUrl } from "~/utils/utils";

const Row = ({ hero, search, useCDN }: { hero: Hero, search: string, useCDN?: boolean }) => {
  const { currentChoose, updateItemRow } = useDataStore();

  const heroMatch = [hero.name, hero.nameCN, hero.nameEN].some(i => i.includes(search));
  const abilitiesMatch = hero.abilities.filter(i => [i.name, i.nameCN].some(j => j.includes(search))).map(i => i.name);

  return (
    <div className="items-center gap-1" style={{
      display: (heroMatch || abilitiesMatch.length > 0) && currentChoose ? 'flex' : 'none'
    }}>
      <Tooltip title={<span className="text-base">{hero.name}</span>}>
        <div>
          <LazyLoadImage
            height={80}
            width={128}
            style={{
              cursor: currentChoose && currentChoose.abilityIndex < 0 ? 'pointer' : 'not-allowed',
              filter: `grayscale(${heroMatch ? 0 : 1})`
            }}
            src={getImgUrl(useCDN, 'heroes', hero.name)}
            alt="hero"
            onClick={() => currentChoose && currentChoose.abilityIndex < 0 && updateItemRow(hero)}
          />
        </div>
      </Tooltip>
      {
        hero.abilities.map(ability => (
          <Tooltip key={ability.name} title={<span className="text-base">{ability.name}</span>}>
            <div>
              <LazyLoadImage
                height={64}
                width={64}
                style={{
                  cursor: currentChoose && currentChoose.abilityIndex >= 0 ? 'pointer' : 'not-allowed',
                  filter: `grayscale(${abilitiesMatch.includes(ability.name) ? 0 : 1})`
                }}
                src={getImgUrl(useCDN, 'abilities', ability.name)}
                alt="ability"
                onClick={() => currentChoose && currentChoose.abilityIndex >= 0 && updateItemRow(ability)}
              />
            </div>
          </Tooltip>
        ))
      }
    </div>
  )
}

const ChooseDialog = ({ useCDN }:{ useCDN?: boolean }) => {
  const { heroList, currentChoose, setCurrentChoose } = useDataStore();

  const [search, setSearch] = useState('');

  const onClose = () => setCurrentChoose(null);

  return (
    <Dialog
      open={!!currentChoose}
      fullWidth
      keepMounted
      maxWidth={false}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Select</DialogTitle>
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
            placeholder="Search... (Support English/中文)"
            className="w-80 rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-wrap justify-evenly gap-12">
          {
            heroList.map(hero => (
              <Row key={hero.id} hero={hero} search={search} useCDN={useCDN} />
            ))
          }
        </div>
      </DialogContent>
      <div className="my-3 flex justify-center">
        <Button variant='contained' size="large" onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  )
}

export default ChooseDialog;