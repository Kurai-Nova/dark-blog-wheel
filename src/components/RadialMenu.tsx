
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
  accentColor?: string; // for future usage
}

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items,
  centerLabel = "Меню",
  accentColor,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [tooltip, setTooltip] = useState<{id:number, label:string, pos:Point}|null>(null);
  const [dimensions, setDimensions] = useState<{ w: number, h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (root) {
      setDimensions({ w: root.offsetWidth, h: root.offsetHeight });
    }
    const handleResize = () => {
      if (root) setDimensions({ w: root.offsetWidth, h: root.offsetHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only one level of expansion at a time for clarity
  const handleExpand = (id: number, item: MenuItem, level: number) => {
    let newExpanded = expanded.slice(0, level); // collapse sublevels
    if (expanded[level] === id) {
      // collapse if already open
      setExpanded(newExpanded);
    } else {
      setExpanded([...newExpanded, id]);
    }
  };

  // Recursive layout & render for N-level menus
  // Only expanded branches are rendered for performance
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
      const isExpanded = expanded[level] === idCounter + 1;
      const id = ++idCounter;
      let pos = center;
      if (level > 0 || parent !== undefined) {
        // for submenu, spread out
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
        // submenus?
      });
      if (item.children && expanded[level] === id) {
        // place next level
        result.push(
          ...renderMenu(item.children, pos, Math.max(radius * 0.68, 55), level + 1, id)
        );
      }
    });
    return result;
  }

  idCounter = 0;
  const cx = Math.round((dimensions.w || 520) / 2);
  const cy = Math.round((dimensions.h || 520) / 2);
  // For first render, fallback to default
  const layout = renderMenu(
    [{ label: centerLabel, children: items }],
    { x: cx, y: cy },
    Math.min(cx, cy, 170),
    0,
    undefined
  );

  // Render
  return (
    <div ref={rootRef} className="menu-root" style={{ minHeight: 260 }}>
      {layout.map((it) => {
        const isExpanded = expanded[it.level] === it.id;
        const parentExpanded = it.level === 0 || expanded[it.level - 1] === it.parent;
        // Skip hidden children
        if ((it.level > 0 && !parentExpanded) || (it.level > 1 && !expanded[it.level-1])) return null;
        const item = it;
        const style: React.CSSProperties = {
          left: item.position.x - (item.isCenter ? 31 : 22),
          top: item.position.y - (item.isCenter ? 31 : 22),
          zIndex: it.isCenter ? 9 : (7+it.level),
          opacity: parentExpanded ? 1 : 0.3,
          transition: "left 0.48s cubic-bezier(.82,0,.39,1.32), top 0.48s cubic-bezier(.82,0,.39,1.32)",
        };
        return (
          <React.Fragment key={item.id}>
            <div
              className={item.isCenter ? 'radial-dot radial-dot--center' : 'radial-dot'}
              style={style}
              onClick={e => {
                e.stopPropagation();
                if (item.isCenter && items.length) {
                  handleExpand(item.id, { ...item }, item.level)
                } else if (items && items[item.id-2] && items[item.id-2].children) {
                  handleExpand(item.id, { ...item }, item.level)
                } else if (!item.isCenter && items && items[item.id-2] && items[item.id-2].onClick) {
                  items[item.id-2].onClick?.();
                  setExpanded([]);
                }
              }}
              onMouseEnter={e => {
                setTooltip({id:item.id, label:item.label, pos:{
                  x: item.position.x,
                  y: item.position.y + (item.isCenter?32:22)
                }});
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {item.label[0]}
            </div>
            {tooltip && tooltip.id === item.id && (
              <div
                className="radial-caption"
                style={{
                  left: tooltip.pos.x,
                  top: tooltip.pos.y + 8,
                }}
              >
                {item.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RadialMenu;
