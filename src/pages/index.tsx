import { useEffect } from "react";
import { type Choose } from "~/utils/type";
import ItemRows from "~/components/ItemRows";
import ConfigSettings from "~/components/Config";
import ChooseDialog from "~/components/Choose";
import { useDataStore } from "~/utils/dataStore";
import { Divider, IconButton } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function HomePage() {
  const { initHeroList, setCurrentChoose } = useDataStore();

  useEffect(() => {
    initHeroList();
  }, [initHeroList])
  
  const onOpenChoose = (choose: Choose) => {
    setCurrentChoose(choose);
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-8">
        <ConfigSettings />
        <Divider orientation="horizontal" className="w-full" />
        <ItemRows onOpenChoose={onOpenChoose} />
        <ChooseDialog />
      </div>
      <a href="https://github.com/yunyuyuan/dota2omg-recording-tool" target="_blank" className="fixed right-2 top-2" rel="noreferrer">
        <IconButton>
          <GitHub />
        </IconButton>
      </a>
    </div>
  );
}
