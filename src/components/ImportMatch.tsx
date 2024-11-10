import { CloseSharp, EmojiEventsOutlined, FileDownloadOutlined, RefreshOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useDataStore } from "~/utils/dataStore";
import { type ItemRow } from "~/utils/type";
import { getImgUrl, useNotifications } from "~/utils/utils";

const ImportMatchDialog = ({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) => {
  const { notify } = useNotifications();
  const { heroList, abilityList, initItemRows } = useDataStore();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [radiantWin, setRadiantWin] = useState(false);
  const [replayUrl, setReplayUrl] = useState('');
  const [teams, setTeams] = useState<ItemRow[][]>([[], []]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const importMatch = async () => {
    const matchId = search.trim();
    if (!matchId) return;
    setLoading(true);
    try {
      const res = await axios.get<{
        game_mode: number;
        radiant_win: boolean;
        replay_url: string;
        players: {
          team_number: number;
          hero_id: number;
          ability_upgrades_arr: number[];
        }[]
      }>(`https://api.opendota.com/api/matches/${matchId}`);
      if (res.status === 200) {
        const data = res.data;
        if (data.game_mode !== 18) {
          notify('Match is not a Ability Draft Mode match', 'error');
        } else {
          setRadiantWin(data.radiant_win);
          setReplayUrl(data.replay_url);
          const radiantPlayers = data.players.filter(player => player.team_number === 0);
          const direPlayers = data.players.filter(player => player.team_number === 1);
          setTeams([radiantPlayers, direPlayers].map(players => 
            players.map(player => {
              const hero = heroList.find(hero => hero.id === player.hero_id) ?? heroList[0]!;
              const abilitiesSet = Array.from(new Set(player.ability_upgrades_arr)).slice(0, 4);
              for (let i = abilitiesSet.length; i < 4; i++) {
                abilitiesSet.push(abilityList[0]!.id);
              }
              return {
                hero,
                abilities: abilitiesSet.map(abilityId => abilityList.find(ability => ability.id === abilityId) ?? abilityList[0]!),
              }
            })
          ));
        }
      } else {
        throw new Error('Failed to fetch match data');
      }
    } catch (err) {
      notify(`Failed to import match: ${JSON.stringify(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  const onChoose = (teamIndex: number) => {
    initItemRows(teams[teamIndex]!);
    onClose();
  }

  return (
    <Dialog
      open={open}
      keepMounted
      maxWidth={false}
      onClose={onClose}
    >
      <DialogTitle>Import Match</DialogTitle>
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
      <DialogContent className="relative">
        <div className="mb-5 flex items-center justify-center gap-4">
          <input
            ref={inputRef}
            type="number"
            min="1"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter Match ID"
            className="w-40 rounded border border-gray-300 p-2"
          />
          <div className="my-3 flex justify-center">
            <Button variant='contained' onClick={() => !loading && importMatch()}>
              {
                loading && <RefreshOutlined className="mr-1 animate-spin" fontSize="small" />
              }
              Import
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-16">
          {
            teams[0]!.length > 0 &&
            teams.map((players, teamIndex) => (
              <div className="mb-8 flex flex-col items-center" key={teamIndex.toString()}>
                <div className="h-8 self-start text-sm text-[#0dbc1b]">
                  {
                    radiantWin === (teamIndex === 0) &&
                    <>
                      <EmojiEventsOutlined fontSize="small" />Win
                    </>
                  }
                </div>
                <div className="mb-4 flex h-10 items-center gap-0.5">
                {
                  players.map(player => (
                    <img
                      key={player.hero.id.toString()}
                      className="h-full rounded-md"
                      src={getImgUrl(false, 'heroes', player.hero.name)}
                      alt="hero"
                    />
                  ))
                }
                </div>
                <Button variant="outlined" onClick={() => onChoose(teamIndex)}>Choose {teamIndex === 0 ? 'radiant' : 'dire'}</Button>
              </div>
            ))
          }
        </div>
        {
          replayUrl && (
          <Tooltip placement="top" title={<span className="text-base">Download Replay</span>}>
            <a download target="_blank" href={replayUrl} className="absolute bottom-1 right-1" rel="noreferrer">
              <IconButton>
                <FileDownloadOutlined />
              </IconButton>
            </a>
          </Tooltip>
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default ImportMatchDialog;