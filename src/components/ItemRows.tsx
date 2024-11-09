import { Button } from "@mui/material";
import { useRef } from "react";
import { useStore } from "~/utils/store";
import domtoimage from 'dom-to-image';
import { type Choose } from "~/utils/type";
import { useNotifications } from "@toolpad/core/useNotifications";

export default function ItemRows({ onOpenChoose }: { onOpenChoose: (choose: Choose) => void }) {
  const notifications = useNotifications();

  const containerRef = useRef<HTMLDivElement>(null);

  const { config, itemRows } = useStore();

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
        notifications.show('导出成功', { severity: 'success', autoHideDuration: 2000 });
      }).catch(err => {
        notifications.show(`导出失败: ${(err as string).toString()}`, { severity: 'error', autoHideDuration: 2000 });
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={containerRef} className="flex flex-col border border-dashed border-gray-700" style={{
        padding: `${config.paddingY}px ${config.paddingX}px`,
        gap: `${config.gapY}px`
      }}>
        {
          itemRows.map((i, index1) => (
            <div key={i.hero.id} className="flex items-stretch" style={{
              height: `${config.size}px`,
              gap: `${config.gapX}px`
            }}>
              <img
                className="h-full"
                style={{ borderRadius: `${config.roundedHero}px` }}
                src={`/data-images/${i.hero.name}.png`}
                alt="hero"
                onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: -1 })}
              />
              {
                i.abilities.map((i, index2) => (
                  <img
                    className="h-full"
                    style={{ borderRadius: `${config.roundedAbility}px` }}
                    key={i.name}
                    src={`/data-images/${i.name}.png`}
                    alt="ability"
                    onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: index2 })}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
      <Button variant="contained" size="large" onClick={onExport}>导出</Button>
    </div>
  )
}