import { Button, Slider } from "@mui/material";
import { useEffect } from "react";
import { useConfigStore } from "~/utils/configStore";
import { ConfigNames, ConfigRange } from "~/utils/type";

const ConfigSettings = () => {
  const { config, initConfig, resetConfig, updateConfig } = useConfigStore();
  
  useEffect(() => initConfig(), [initConfig])
  
  return (
    <div className="grid grid-cols-4 items-center gap-4 pt-8">
    {
      Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-2">
          <span>{ConfigNames[key]}</span>
          <div className="w-40">
            <Slider
              value={value}
              min={ConfigRange[key]![0]}
              max={ConfigRange[key]![1]}
              valueLabelDisplay="auto"
              onChange={(_, value) => updateConfig(key, value as number)}
              aria-labelledby="input-slider"
            />
          </div>
        </div>
      ))
    }
    <Button variant="contained" onClick={resetConfig}>Reset Config</Button>
    </div>
  )
}

export default ConfigSettings;