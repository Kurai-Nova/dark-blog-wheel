
import React, { useRef, useEffect, useState } from 'react';

type MenuItem = {
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
};

type Point = { x: number; y: number };

type RenderedItem = {
  id: number;
  level: number;
  parent?: number;
  label: string;
  position: Point;
  isCenter: boolean;
  hasChildren: boolean;
};

let idCounter = 0;

function getCirclePoints(center: Point, radius: number, count: number, startAngle = -90) {
  if (count === 0) return [];
  const step = 360 / count;
  return new Array(count).fill(undefined).map((_, i) => {
    const angle = ((startAngle + step * i) * Math.PI) / 180;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });
}

interface RadialMenuProps {
  items: MenuItem[];
  centerLabel?: string;
  accentColor?: string;
}

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items,
  centerLabel = "Меню",
  accentColor,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState<{ w: number, h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const updateDims = () => {
      if (rootRef.current) {
        setDimensions({ w: rootRef.current.offsetWidth, h: rootRef.current.offsetHeight });
      }
    }
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  const handleExpand = (id: number, item: MenuItem, level: number) => {
    let newExpanded = expanded.slice(0, level);
    if (expanded[level] === id) {
      setExpanded(newExpanded);
    } else {
      setExpanded([...newExpanded, id]);
    }
  };

  // Основная часть — вычисление расположения кружков и их подписей без наложения.
  function renderMenu(
    items: MenuItem[],
    center: Point,
    radius: number,
    level: number,
    parent?: number,
    startAngle = -90
  ): RenderedItem[] {
    let result: RenderedItem[] = [];
    items.forEach((item, index) => {
      const id = ++idCounter;
      let pos = center;
      if (level > 0 || parent !== undefined) {
        // для вложенных элементов считаем точки круга
        const points = getCirclePoints(center, radius, items.length, startAngle);
        pos = points[index];
      }
      result.push({
        id,
        level,
        parent,
        label: item.label,
        position: pos,
        isCenter: level === 0 && parent === undefined,
        hasChildren: !!item.children && item.children.length > 0,
      });
      if (item.children && expanded[level] === id) {
        // вложенные элементы
        result.push(
          ...renderMenu(
            item.children,
            pos,
            Math.max(radius * 0.68, 85), // увеличили минимальный радиус для избежания наезда подписей
            level + 1,
            id
          )
        );
      }
    });
    return result;
  }

  idCounter = 0;
  // Делаем центр по вертикали и горизонтали, учитывая реальный размер контейнера
  const cx = Math.round((dimensions.w || 520) / 2);
  const cy = Math.round((dimensions.h || 520) / 2);
  const baseRadius = Math.min(cx, cy) - 80; // минус отступ для подписи
  const layout = renderMenu(
    [{ label: centerLabel, children: items }],
    { x: cx, y: cy },
    Math.max(baseRadius, 115), // сделал радиус чуть больше
    0,
    undefined
  );

  // Рендерим меню
  return (
    <div ref={rootRef} className="menu-root" style={{
      minHeight: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {layout.map((item, idx) => {
        const isExpanded = expanded[item.level] === item.id;
        const parentExpanded = item.level === 0 || expanded[item.level - 1] === item.parent;
        if ((item.level > 0 && !parentExpanded) || (item.level > 1 && !expanded[item.level-1])) return null;

        // Цвет круга зависит от наличия вложенных элементов
        let dotClass = "radial-dot";
        if (item.isCenter) {
          dotClass += " radial-dot--center";
        } else if (item.hasChildren) {
          dotClass += " radial-dot--has-children";
        } else {
          dotClass += " radial-dot--no-children";
        }

        const style: React.CSSProperties = {
          left: item.position.x - (item.isCenter ? 31 : 22),
          top: item.position.y - (item.isCenter ? 31 : 22),
          zIndex: item.isCenter ? 9 : (7+item.level),
          opacity: parentExpanded ? 1 : 0.25,
          transition: "left 0.48s cubic-bezier(.82,0,.39,1.32), top 0.48s cubic-bezier(.82,0,.39,1.32)",
        };

        // Подпись будет под кружком всегда (не в тултипе)
        const captionStyle: React.CSSProperties = {
          left: item.position.x,
          top: item.position.y + (item.isCenter ? 55 : 40),
          width: 120,
          transform: "translate(-50%, 0)",
          position: "absolute",
          fontSize: item.isCenter ? "1.23rem" : "1rem",
          fontWeight: "bold",
          color: item.isCenter
            ? "var(--color-accent, #4bb6fa)"
            : item.hasChildren
              ? "var(--color-accent, #4bb6fa)"
              : "#e3e7ef",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
          textShadow: "0 2px 14px #161a2094",
          zIndex: 10,
        };

        return (
          <React.Fragment key={item.id}>
            <div
              className={dotClass}
              style={style}
              onClick={e => {
                e.stopPropagation();
                if (item.isCenter && items.length) {
                  handleExpand(item.id, { ...item }, item.level)
                } else if (item.hasChildren) {
                  handleExpand(item.id, { ...item }, item.level)
                } else if (!item.isCenter && !item.hasChildren && items && items[item.id-2] && items[item.id-2].onClick) {
                  items[item.id-2].onClick?.();
                  setExpanded([]);
                }
              }}
            />
            <div className="radial-label" style={captionStyle}>
              {item.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RadialMenu;
