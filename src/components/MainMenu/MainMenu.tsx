import React, { useState, useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import './style.scss';

type MenuItemProps = {
  label: string;
  onClick?: (navigate?: (path: string) => void) => void;
  children?: MenuItemProps[];
};

type MainMenuProps = {
  navigate?: (path: string) => void;
};

const menuItems: MenuItemProps[] = [
  {
    label: "Здоровье",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#health") : window.location.href = "/#health",
  },
  {
    label: "Спорт",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/sport") : window.location.href = "/sport",
  },
  {
    label: "Путешествия",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#travel") : window.location.href = "/#travel",
  },
  {
    label: "IT",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#it") : window.location.href = "/#it",
  },
  {
    label: "Мысли",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#thoughts") : window.location.href = "/#thoughts",
  },
  {
    label: "Библиотека",
    children: [
      {
        label: "Книги",
        onClick: (navigate?: (path: string) => void) => navigate ? navigate("/library#books") : window.location.href = "/library#books",
      },
      {
        label: "Статьи",
        onClick: (navigate?: (path: string) => void) => navigate ? navigate("/library#articles") : window.location.href = "/library#articles",
      }
    ]
  },
];

const MainMenu: React.FC<MainMenuProps> = ({ navigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerPosition, setCenterPosition] = useState<[number, number]>([0, 0]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Обновляем центр при изменении размеров
  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCenterPosition([
          rect.width / 2,
          rect.height / 2
        ]);
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // Обработчик открытия/закрытия элементов
  const handleToggle = (key: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);

      // Закрываем дочерние элементы
      Array.from(prev).forEach(itemKey => {
        if (itemKey.startsWith(`${key}-`)) {
          newSet.delete(itemKey);
        }
      });

      // Переключаем текущий элемент
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }

      return newSet;
    });
  };

  // Проверяем, есть ли открытые дочерние элементы
  const hasOpenChild = (key: string): boolean => {
    return Array.from(openItems).some(itemKey =>
      itemKey.startsWith(`${key}-`)
    );
  };

  return (
    <div
      ref={containerRef}
      className="dot-menu-container"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={`root-${index}`}
          item={item}
          parentPosition={centerPosition}
          level={0}
          index={index}
          totalSiblings={menuItems.length}
          startAngle={-90}
          isRoot={true}
          navigate={navigate}
          onToggle={handleToggle}
          isOpen={openItems.has(`root-${index}`)}
          itemKey={`root-${index}`}
          hasOpenChild={hasOpenChild(`root-${index}`)}
        />
      ))}
    </div>
  );
};

export default MainMenu;
