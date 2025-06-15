import React, { useState, useEffect, useRef } from 'react';
import { getCirclePosition, getItemAngle } from './mathUtils';

type MenuItem = {
  label: string;
  onClick?: (navigate?: (path: string) => void) => void;
  children?: MenuItem[];
};

type DotMenuItemProps = {
  item: MenuItem;
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
  hasOpenChild
}) => {
  const [position, setPosition] = useState<[number, number]>(parentPosition);
  const captionRef = useRef<HTMLDivElement>(null);
  const radius = 150 / (level + 1);
  const isActive = item.children ? isOpen : false;

  // Определяем класс для точки
  const getDotClass = () => {
    if (!item.children) return 'dotempty';
    return hasOpenChild || isOpen ? 'dotoff' : 'dot';
  };

  // Рассчитываем позицию элемента
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

  // Обработчик клика
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.children) {
      onToggle(itemKey);
    } else if (item.onClick) {
      item.onClick(navigate);
    }
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
        ref={captionRef}
        className="caption"
        style={{
          left: `${position[0]}px`,
          top: `${position[1] + 15}px`,
          opacity: hasOpenChild ? 0.5 : 1
        }}
      >
        {item.label}
      </div>

      {item.children && isOpen && (
        <>
          {item.children.map((child, childIndex) => (
            <MenuItem
              key={`${itemKey}-${childIndex}`}
              item={child}
              parentPosition={position}
              level={level + 1}
              index={childIndex}
              totalSiblings={item.children?.length ?? 0}
              startAngle={startAngle}
              navigate={navigate}
              onToggle={onToggle}
              isOpen={isOpen}
              itemKey={`${itemKey}-${childIndex}`}
              hasOpenChild={false}
            />
          ))}
        </>
      )}
    </>
  );
};

export default MenuItem;
