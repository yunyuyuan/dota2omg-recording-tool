import { useEffect, useState } from "react";
import { type Choose } from "~/utils/type";
import ItemRows from "~/components/ItemRows";
import ConfigSettings from "~/components/Config";
import ChooseDialog from "~/components/Choose";
import { useDataStore } from "~/utils/dataStore";
import { Divider, IconButton, Switch, Tooltip } from "@mui/material";
import { ExpandCircleDownOutlined, GitHub, HelpOutline } from "@mui/icons-material";

const STORAGE_KEY = 'dota2omg-recording-tool-use-cdn'

export default function HomePage() {
  const { initHeroList, setCurrentChoose } = useDataStore();
  
  const [useCDN, setUseCDN] = useState(false);

  useEffect(() => {
    initHeroList();
  }, [initHeroList])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUseCDN(window.localStorage.getItem(STORAGE_KEY) === 'true');
    }
  }, [])
  
  const saveUseCDN = (useCDN: boolean) => {
    setUseCDN(useCDN);
    window.localStorage.setItem(STORAGE_KEY, useCDN ? 'true' : 'false');
  }
  
  const onOpenChoose = (choose: Choose) => {
    setCurrentChoose(choose);
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <ConfigSettings />
        <Divider orientation="horizontal" className="w-full">
          <ExpandCircleDownOutlined fontSize="small" className="mr-1 animate-bounce" />Result
        </Divider>
        <div className="my-5 flex items-center text-[#555]">
          <Switch size="small" checked={useCDN} onChange={(e) => saveUseCDN(e.target.checked)} />
          <span className="text-sm">Use Steam CDN</span>
          <Tooltip 
            title={<span className="text-base">Use SteamCDN to load images faster, but it may fail due to frequent requests.</span>}
            placement="top"
          >
            <HelpOutline fontSize="small" color="inherit" className="ml-1" />
          </Tooltip>
        </div>
        <ItemRows useCDN={useCDN} onOpenChoose={onOpenChoose} />
        <ChooseDialog useCDN={useCDN}  />
      </div>
      <a href="https://github.com/yunyuyuan/dota2omg-recording-tool" target="_blank" className="fixed right-2 top-2" rel="noreferrer">
        <IconButton>
          <GitHub />
        </IconButton>
      </a>
    </div>
  );
}
