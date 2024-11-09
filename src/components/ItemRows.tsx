import { Button } from "@mui/material";
import { useRef } from "react";
import { useDataStore } from "~/utils/dataStore";
import domtoimage from 'dom-to-image';
import { type Choose } from "~/utils/type";
import { useConfigStore } from "~/utils/configStore";
import { getImgUrl, useNotifications } from "~/utils/utils";

export default function ItemRows({ useCDN, onOpenChoose }: { useCDN?: boolean, onOpenChoose: (choose: Choose) => void }) {
  const { notify } = useNotifications()

  const containerRef = useRef<HTMLDivElement>(null);

  const { itemRows } = useDataStore();
  const { config } = useConfigStore();

  const onExport = () => {
    if (containerRef.current) {
      domtoimage.toPng(containerRef.current, {
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight
      }).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'export.png';
        link.href = dataUrl;
        link.click();
        notify('Export successful!', 'success');
      }).catch(err => {
        notify(`Export failed: ${(err as string).toString()}`, 'error');
      })
    }
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-6">
      <div className="border border-dashed" style={{
        borderColor: (config.paddingY || config.paddingX) ? '#666' : 'transparent',
      }}>
        <div ref={containerRef} className="flex flex-col" style={{
          padding: `${config.paddingY}px ${config.paddingX}px`,
          gap: `${config.gapY}px`
        }}>
          {
            itemRows.map((i, index1) => (
              <div key={i.hero.id + index1} className="flex items-stretch" style={{
                height: `${config.size}px`,
                gap: `${config.gapX}px`
              }}>
                <img
                  className="h-full cursor-pointer transition-all hover:scale-105"
                  style={{ borderRadius: `${config.roundedHero}px` }}
                  src={getImgUrl(useCDN, 'heroes', i.hero.name)}
                  alt="hero"
                  onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: -1 })}
                />
                {
                  i.abilities.map((i, index2) => (
                    <img
                      className="h-full cursor-pointer transition-all hover:scale-105"
                      style={{ borderRadius: `${config.roundedAbility}px` }}
                      key={i.name + index2}
                      src={getImgUrl(useCDN, 'abilities', i.name)}
                      alt="ability"
                      onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: index2 })}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      <Button variant="contained" size="large" onClick={onExport}>Export</Button>
    </div>
  )
}