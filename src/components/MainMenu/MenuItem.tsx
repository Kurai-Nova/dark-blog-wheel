import React, { useState, useEffect } from 'react';
import { getCirclePosition, getItemAngle } from './mathUtils';
import type { MenuItemProps } from './items';

type DotMenuItemProps = {
  item: MenuItemProps;
  parentPosition: [number, number];
  level: number;
  index: number;
  totalSiblings: number;
  startAngle: number;
  isRoot?: boolean;
  navigate?: (path: string) => void;
  onToggle: (key: string) => void;
  isOpen: boolean;
  itemKey: string;
  hasOpenChild: boolean;
  openItems: Set<string>;
};

const MenuItem: React.FC<DotMenuItemProps> = ({
  item,
  parentPosition,
  level,
  index,
  totalSiblings,
  startAngle,
  isRoot = false,
  navigate,
  onToggle,
  isOpen,
  itemKey,
  hasOpenChild,
  openItems
}) => {
  const [position, setPosition] = useState<[number, number]>(parentPosition);

  // Радиус с уменьшением для подуровней
  const baseRadius = 190;
  const radius = isRoot ? 0 : baseRadius * (1 - level * 0.35);

  useEffect(() => {
    const angle = getItemAngle(index, totalSiblings, startAngle);
    const newPosition = getCirclePosition(
      parentPosition[0],
      parentPosition[1],
      radius,
      angle
    );
    setPosition(newPosition);
  }, [parentPosition, radius, index, totalSiblings, startAngle]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.children) onToggle(itemKey);
    else if (item.onClick) item.onClick(navigate);
  };

  const getDotClass = () => {
    if (!item.children) return 'dotempty';
    return hasOpenChild || isOpen ? 'dotoff' : 'dot';
  };

  return (
    <>
      <div
        className={getDotClass()}
        style={{
          left: `${position[0]}px`,
          top: `${position[1]}px`,
          transition: isRoot ? 'none' : 'all 0.3s ease-out'
        }}
        onClick={handleClick}
      />

      <div
        className="caption"
        style={{
          left: `${position[0]}px`,
          top: `${position[1] + 15}px`,
          opacity: hasOpenChild ? 0.5 : 1
        }}
      >
        {item.label}
      </div>

      {item.children && isOpen && item.children.map((child, childIndex) => {
        const childKey = `${itemKey}-${childIndex}`;
        return (
          <MenuItem
            key={childKey}
            item={child}
            parentPosition={position}
            level={level + 1}
            index={childIndex}
            totalSiblings={item.children?.length || 0}
            startAngle={startAngle}
            navigate={navigate}
            onToggle={onToggle}
            isOpen={openItems.has(childKey)}
            itemKey={childKey}
            hasOpenChild={Array.from(openItems).some(k => k.startsWith(`${childKey}-`))}
            openItems={openItems}
          />
        );
      })}
    </>
  );
};

export default MenuItem;
