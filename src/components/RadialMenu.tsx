
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
  onClick?: () => void;
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
}

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items,
  centerLabel = "Меню",
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState<{ w: number, h: number }>({ w: 0, h: 0 });
  const [recentlyExpandedLevel, setRecentlyExpandedLevel] = useState<number | null>(null);

  useEffect(() => {
    const updateDims = () => {
      if (rootRef.current) {
        setDimensions({ w: rootRef.current.offsetWidth, h: rootRef.current.offsetHeight });
        console.log("☑️ .menu-root dimensions:", rootRef.current.offsetWidth, rootRef.current.offsetHeight);
      }
    }
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    if (recentlyExpandedLevel !== null) {
      const timeout = setTimeout(() => setRecentlyExpandedLevel(null), 520);
      return () => clearTimeout(timeout);
    }
  }, [recentlyExpandedLevel]);

  const handleExpand = (id: number, level: number) => {
    let newExpanded = expanded.slice(0, level);
    if (expanded[level] === id) {
      setExpanded(newExpanded);
      setRecentlyExpandedLevel(null);
    } else {
      setExpanded([...newExpanded, id]);
      setRecentlyExpandedLevel(level);
    }
  };

  function renderMenu(
    items: MenuItem[],
    center: Point,
    radius: number,
    level: number,
    parent?: number,
    startAngle = -90
  ): RenderedItem[] {
    let result: RenderedItem[] = [];
    
    // Для дочерних элементов вычисляем позиции по кругу
    const positions = level > 0 ? getCirclePoints(center, radius, items.length, startAngle) : [center];
    
    items.forEach((item, index) => {
      const id = ++idCounter;
      const pos = level === 0 && parent === undefined ? center : positions[index];
      
      result.push({
        id,
        level,
        parent,
        label: item.label,
        position: pos,
        isCenter: level === 0 && parent === undefined,
        hasChildren: !!item.children && item.children.length > 0,
        onClick: item.onClick,
      });
      
      if (item.children && expanded[level] === id) {
        result.push(
          ...renderMenu(
            item.children,
            pos, // дочерние элементы размещаются вокруг своего родителя
            Math.max(radius * 0.68, 85),
            level + 1,
            id
          )
        );
      }
    });
    return result;
  }

  idCounter = 0;
  const cx = Math.round((dimensions.w || 520) / 2);
  const cy = Math.round((dimensions.h || 520) / 2);

  let baseRadius = Math.max(Math.min(cx, cy) - 80, 80);

  if (!dimensions.w || !dimensions.h) {
    return (
      <div ref={rootRef} className="menu-root">
        {/* menu dimensions not ready */}
      </div>
    );
  }

  const layout = renderMenu(
    [{ label: centerLabel, children: items }],
    { x: cx, y: cy },
    baseRadius,
    0,
    undefined
  );

  return (
    <div ref={rootRef} className="menu-root" style={{
      minHeight: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {layout.map((item) => {
        const parentExpanded = item.level === 0 || expanded[item.level - 1] === item.parent;
        if ((item.level > 0 && !parentExpanded) || (item.level > 1 && !expanded[item.level-1])) return null;

        let dotClass = "radial-dot";
        if (item.isCenter) {
          dotClass += " radial-dot--center";
        } else if (item.hasChildren) {
          dotClass += " radial-dot--has-children";
        } else {
          dotClass += " radial-dot--no-children";
        }

        let animationClass = "";
        if (
          item.level === 1 &&
          recentlyExpandedLevel === 0 && // тыц по центру
          parentExpanded
        ) {
          animationClass = " animate-fade-in animate-scale-in";
        }

        const style: React.CSSProperties = {
          left: item.position.x - (item.isCenter ? 31 : 22),
          top: item.position.y - (item.isCenter ? 31 : 22),
          zIndex: item.isCenter ? 9 : (7+item.level),
          opacity: parentExpanded ? 1 : 0.25,
          transition: "left 0.48s cubic-bezier(.82,0,.39,1.32), top 0.48s cubic-bezier(.82,0,.39,1.32)",
        };

        const captionStyle: React.CSSProperties = {
          left: item.position.x,
          top: item.position.y + (item.isCenter ? 55 : 40),
          width: 120,
          transform: "translate(-50%, 0)",
          position: "absolute",
          fontSize: item.isCenter ? "1.23rem" : "0.94rem",
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

        const hideLabel = item.isCenter && expanded.length > 0 && typeof expanded[0] !== "undefined";

        return (
          <React.Fragment key={item.id}>
            <div
              className={dotClass + animationClass}
              style={style}
              onClick={e => {
                e.stopPropagation();
                if (item.isCenter && items.length) {
                  handleExpand(item.id, item.level)
                } else if (item.hasChildren) {
                  handleExpand(item.id, item.level)
                } else if (item.onClick) {
                  item.onClick();
                  setExpanded([]);
                }
              }}
            />
            {!hideLabel && (
              <div className="radial-label" style={captionStyle}>
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
