import { Slider } from "@mui/material";
import { useStore } from "~/utils/store";
import { ConfigRange } from "~/utils/type";

const ConfigSettings = () => {
  const { config, updateConfig } = useStore();

  const update = (key: string, value: number) => {
    updateConfig({
      ...config,
      [key]: value
    })
  }
  
  return (
    <div className="flex flex-wrap gap-6">
    {
      Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-2">
          <span>{key}</span>
          <div className="w-40">
            <Slider
              value={value}
              min={ConfigRange[key]![0]}
              max={ConfigRange[key]![1]}
              valueLabelDisplay="auto"
              onChange={(_, value) => update(key, value as number)}
              aria-labelledby="input-slider"
            />
          </div>
        </div>
      ))
    }
    </div>
  )
}

export default ConfigSettings;