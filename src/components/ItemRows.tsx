import { Button } from "@mui/material";
import { useRef, useState, type DragEvent } from "react";
import { useDataStore } from "~/utils/dataStore";
import domtoimage from 'dom-to-image';
import { type Choose } from "~/utils/type";
import { useConfigStore } from "~/utils/configStore";
import clsx from 'clsx';
import { getImgUrl, useNotifications } from "~/utils/utils";
import { CloudDownloadOutlined, EmojiObjectsOutlined, FileUploadOutlined } from "@mui/icons-material";
import ImportMatchDialog from "./ImportMatch";

export default function ItemRows({ onOpenChoose }: { onOpenChoose: (choose: Choose) => void }) {
  const { notify } = useNotifications()

  const [showImport, setShowImport] = useState(false);
  const [currentDragType, setCurrentDragType] = useState<'hero' | 'ability'>('hero');
  const [currentDragIndex, setCurrentDragIndex] = useState<number[]>([]);
  const [currentDragOverIndex, setCurrentDragOverIndex] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { itemRows, swapItemRow } = useDataStore();
  const { config } = useConfigStore();
  
  const handleHeroDrag = (index: number) => () => {
    setCurrentDragType('hero');
    setCurrentDragIndex([index]);
  }
  const handleHeroDragOver = (index: number) => (event: DragEvent) => {
    event.preventDefault();
    if (currentDragType === 'hero') {
      if (index !== currentDragOverIndex[0]) {
        setCurrentDragOverIndex([index]);
      }
    }
  }
  const handleHeroDrop = (index: number) => (event: DragEvent) => {
    event.preventDefault();
    if (currentDragType === 'hero') {
      swapItemRow(currentDragIndex, [index]);
      setCurrentDragIndex([]);
      setCurrentDragOverIndex([]);
    }
  }

  const handleAbilityDrag = (index1: number, index2: number) => () => {
    setCurrentDragType('ability');
    setCurrentDragIndex([index1, index2]);
  }
  const handleAbilityDragOver = (index1: number, index2: number) => (event: DragEvent) => {
    event.preventDefault();
    if (currentDragType === 'ability') {
      if (index1 !== currentDragOverIndex[0] || index2 !== currentDragOverIndex[1]) {
        setCurrentDragOverIndex([index1, index2]);
      }
    }
  }
  const handleAbilityDrop = (index1: number, index2: number) => (event: DragEvent) => {
    event.preventDefault();
    if (currentDragType === 'ability') {
      swapItemRow(currentDragIndex, [index1, index2]);
      clearDragState();
    }
  }

  const clearDragState = () => {
    setCurrentDragIndex([]);
    setCurrentDragOverIndex([]);
  }

  const onExport = () => {
    if (containerRef.current) {
      domtoimage.toPng(containerRef.current, {
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight
      }).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `dota2omg-export-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        notify('Export successful!', 'success');
      }).catch(err => {
        notify(`Export failed: ${JSON.stringify(err)}`, 'error');
      })
    }
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-1 text-xs text-[#666]">(
        <EmojiObjectsOutlined fontSize="small" />
        Click to choose, Drag/Drop to swap.
      )</div>
      <div className="border border-dashed" style={{
        borderColor: (config.paddingY || config.paddingX) ? '#666' : 'transparent',
      }}>
        <div ref={containerRef} className="flex flex-col" style={{
          padding: `${config.paddingY}px ${config.paddingX}px`,
          gap: `${config.gapY}px`
        }}>
          {
            itemRows.map((i, index1) => (
              <div key={i.hero.id.toString() + index1} className="flex items-stretch" style={{
                height: `${config.size}px`,
                gap: `${config.gapX}px`
              }}>
                <img
                  className={clsx(
                    "h-full cursor-pointer transition-all hover:scale-105",
                    currentDragType === 'hero' && 
                    (currentDragIndex[0] === index1 || currentDragOverIndex[0] === index1) && 
                    'scale-[0.85]' 
                  )}
                  style={{ borderRadius: `${config.roundedHero}px` }}
                  src={getImgUrl(false, 'heroes', i.hero.name)}
                  alt="hero"
                  onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: -1 })}
                  draggable={true}
                  onDragStart={handleHeroDrag(index1)}
                  onDragOver={handleHeroDragOver(index1)}
                  onDragEnd={() => clearDragState()}
                  onDrop={handleHeroDrop(index1)}
                />
                {
                  i.abilities.map((i, index2) => (
                    <img
                      className={clsx(
                        "h-full cursor-pointer transition-all hover:scale-105",
                        currentDragType === 'ability' && 
                        (
                          (currentDragIndex[0] === index1 &&  currentDragIndex[1] === index2) || 
                          (currentDragOverIndex[0] === index1 &&  currentDragOverIndex[1] === index2)
                        ) && 
                        'scale-[0.85]' 
                      )}
                      style={{ 
                        borderRadius: `${config.roundedAbility}px`,
                      }}
                      key={i.id.toString() + index2}
                      src={getImgUrl(false, 'abilities', i.name)}
                      alt="ability"
                      onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: index2 })}
                      draggable={true}
                      onDragStart={handleAbilityDrag(index1, index2)}
                      onDragOver={handleAbilityDragOver(index1, index2)}
                      onDragEnd={() => clearDragState()}
                      onDrop={handleAbilityDrop(index1, index2)}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button className="flex items-center gap-2" variant="contained" size="large" onClick={() => setShowImport(true)}>
          <CloudDownloadOutlined fontSize="small" />
          Import Match
        </Button>
        <Button className="flex items-center gap-2" variant="contained" size="large" onClick={onExport}>
          <FileUploadOutlined fontSize="small" />
          Export
        </Button>
      </div>
      <ImportMatchDialog open={showImport} onClose={() => setShowImport(false)} />
    </div>
  )
}