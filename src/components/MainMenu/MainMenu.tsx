import React, { useRef, useEffect, useState } from 'react';
import './style.scss';

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

function getCirclePoints(
  center: Point,
  radius: number,
  count: number,
  startAngle = -90
): Point[] {
  if (count === 0) return [];
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const angle = (startAngle + step * i) * Math.PI / 180;
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

export const MainMenu: React.FC<RadialMenuProps> = ({
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
        setDimensions({
          w: rootRef.current.offsetWidth,
          h: rootRef.current.offsetHeight
        });
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
    parent?: number
  ): RenderedItem[] {
    let result: RenderedItem[] = [];

    let positions: Point[] = [];

    // Центральный элемент
    if (level === 0) {
      positions = [center];
    }
    // Все дочерние элементы
    else {
      positions = getCirclePoints(center, radius, items.length);
    }

    items.forEach((item, index) => {
      const id = ++idCounter;
      const pos = positions[index];

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
        // Увеличиваем радиус для дочерних элементов
        const childRadius = Math.max(radius * 1.2, 100);
        result.push(
          ...renderMenu(
            item.children,
            pos,
            childRadius,
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
  let baseRadius = Math.max(Math.min(cx, cy) - 100, 100);

  if (!dimensions.w || !dimensions.h) {
    return <div ref={rootRef} className="menu-root" />;
  }

  const layout = renderMenu(
    [{ label: centerLabel, children: items }],
    { x: cx, y: cy },
    baseRadius,
    0
  );

  return (
    <div ref={rootRef} className="menu-root">
      {layout.map((item) => {
        const parentExpanded = item.level === 0 || expanded[item.level - 1] === item.parent;
        if (!parentExpanded) return null;

        // ИСПРАВЛЕННО: Пункты первого уровня с подпунктами всегда активны
        const isActive = item.isCenter ||
          (item.level === 1 && item.hasChildren) ||
          (parentExpanded && (!item.hasChildren || expanded[item.level] === item.id));

        let dotClass = "radial-dot";
        if (item.isCenter) {
          dotClass += " radial-dot--center";
        } else if (item.hasChildren) {
          dotClass += " radial-dot--has-children";
        } else {
          dotClass += " radial-dot--no-children";
        }

        // Неактивность только для нецентральных элементов
        if (!isActive && !item.isCenter) {
          dotClass += " radial-dot--inactive";
        }

        // Анимация для новых элементов
        let animationClass = "";
        if (
          recentlyExpandedLevel === item.level - 1 &&
          parentExpanded &&
          isActive
        ) {
          animationClass = " animate-scale-in";
        }

        const style: React.CSSProperties = {
          left: item.position.x,
          top: item.position.y,
          zIndex: item.isCenter ? 3 : 100 + item.level * 10,
        };

        const labelStyle: React.CSSProperties = {
          left: item.position.x,
          top: item.position.y + (item.isCenter ? 55 : 40),
          fontSize: item.isCenter ? "1.23rem" : "0.94rem",
          color: item.isCenter
            ? "#4bb6fa"
            : item.hasChildren
              ? "#4bb6fa"
              : "#e3e7ef",
          zIndex: item.isCenter ? 10 : 101 + item.level * 10,
        };

        // Неактивность для подписи
        if (!isActive && !item.isCenter) {
          labelStyle.opacity = 0.33;
        }

        const hideLabel = item.isCenter && expanded.length > 0;

        return (
          <React.Fragment key={item.id}>
            <div
              className={dotClass + animationClass}
              style={style}
              onClick={e => {
                e.stopPropagation();
                if (item.isCenter) {
                  if (item.hasChildren) {
                    handleExpand(item.id, item.level);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                } else if (item.hasChildren) {
                  handleExpand(item.id, item.level);
                } else if (item.onClick) {
                  item.onClick();
                }
              }}
            />
            {!hideLabel && (
              <div className="radial-label" style={labelStyle}>
                {item.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MainMenu;
