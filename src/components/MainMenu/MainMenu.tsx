import React, { useState, useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import './style.scss';

import { menuItems, MenuItemProps } from './items';

type MainMenuProps = {
  navigate?: (path: string) => void;
};

const MainMenu: React.FC<MainMenuProps> = ({ navigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerPosition, setCenterPosition] = useState<[number, number] | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCenterPosition([rect.width / 2, rect.height / 2]);
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  const handleToggle = (key: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      Array.from(prev).forEach(itemKey => {
        if (itemKey.startsWith(`${key}-`)) newSet.delete(itemKey);
      });
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const hasOpenChild = (key: string): boolean => {
    return Array.from(openItems).some(itemKey => itemKey.startsWith(`${key}-`));
  };

  const rootItem: MenuItemProps = {
    label: "Меню",
    children: menuItems
  };

  return (
    <div ref={containerRef} className="dot-menu-container">
      {centerPosition && (
        <MenuItem
          key="root"
          item={rootItem}
          parentPosition={centerPosition}
          level={0}
          index={0}
          totalSiblings={1}
          startAngle={-90}
          isRoot={true}
          navigate={navigate}
          onToggle={handleToggle}
          isOpen={openItems.has('root')}
          itemKey="root"
          hasOpenChild={hasOpenChild('root')}
          openItems={openItems}
        />
      )}
    </div>
  );
};

export default MainMenu;
