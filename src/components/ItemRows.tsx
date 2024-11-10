import { Button } from "@mui/material";
import { useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDataStore } from "~/utils/dataStore";
import domtoimage from 'dom-to-image';
import { type Choose } from "~/utils/type";
import { useConfigStore } from "~/utils/configStore";
import { getImgUrl, useNotifications } from "~/utils/utils";

const SortableHero = ({ id, name }: {
  id: string;
  name: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="size-72 cursor-grab rounded bg-gray-100"
      {...attributes}
      {...listeners}
    >
      <img src={getImgUrl(false, 'heroes', name)} alt="" className="size-full rounded object-cover" />
    </div>
  );
};

const SortableAbility = ({ id, name, index }: {
  id: string;
  name: string;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="size-36 cursor-grab rounded bg-gray-100"
      {...attributes}
      {...listeners}
    >
      <img src={getImgUrl(false, 'abilities', name)} alt="" className="size-full rounded object-cover" />
    </div>
  );
};

export default function ItemRows({ onOpenChoose }: { onOpenChoose: (choose: Choose) => void }) {
  const { notify } = useNotifications()

  const containerRef = useRef<HTMLDivElement>(null);

  const { itemRows } = useDataStore();
  const { config } = useConfigStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    <div className="mb-6 flex flex-col items-center gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={itemRows.map(item => item.hero.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {itemRows.map((row, index) => (
              <div key={row.hero.id+index} className="flex items-center gap-4">
                {/* 大图列 */}
                <SortableHero id={row.hero.id.toString()} name={row.hero.name} />
                
                {/* 小图区域 */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                >
                  <SortableContext
                    items={row.abilities.map((ability, idx) => `${ability.name}-small-${idx}`)}
                  >
                    <div className="flex gap-4">
                      {row.abilities.map((ability, idx) => (
                        <SortableAbility
                          key={`${ability.name}-small-${idx}`}
                          id={`${ability.name}-small-${idx}`}
                          name={ability.name}
                          index={idx}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        </SortableContext>

        {/* <DragOverlay>
          {activeId ? (
            <div className="size-72 rounded bg-gray-100 opacity-50">
              <img src={items.find(item => item.id === activeId)?.largeImage} alt="" className="size-full rounded object-cover" />
            </div>
          ) : null}
        </DragOverlay> */}
      </DndContext>
      {/* <div className="border border-dashed" style={{
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
                  src={getImgUrl(false, 'heroes', i.hero.name)}
                  alt="hero"
                  onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: -1 })}
                />
                {
                  i.abilities.map((i, index2) => (
                    <img
                      className="h-full cursor-pointer transition-all hover:scale-105"
                      style={{ borderRadius: `${config.roundedAbility}px` }}
                      key={i.name + index2}
                      src={getImgUrl(false, 'abilities', i.name)}
                      alt="ability"
                      onClick={() => onOpenChoose({ heroIndex: index1, abilityIndex: index2 })}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div> */}
      <Button variant="contained" size="large" onClick={onExport}>Export</Button>
    </div>
  )
}