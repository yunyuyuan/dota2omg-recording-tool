import { useEffect, useState } from "react";
import { type Choose, type Ability, type Hero } from "~/utils/type";
import ItemRows from "~/components/ItemRows";
import ConfigSettings from "~/components/Config";
import ChooseDialog from "~/components/Choose";
import { useStore } from "~/utils/store";

export default function HomePage() {
  const { initHeroList, setCurrentChoose } = useStore();

  useEffect(() => {
    initHeroList();
  }, [initHeroList])
  
  const onOpenChoose = (choose: Choose) => {
    setCurrentChoose(choose);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <ConfigSettings />
      <ItemRows onOpenChoose={onOpenChoose} />
      <ChooseDialog />
    </div>
  );
}
