
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { menuItems, MenuItemProps } from "./MainMenu/items";

// Вспомогательная функция для поиска item по сегментам URL
function findMenuPathByUrl(pathParts: string[]): {item: MenuItemProps; key: string}[] {
  let items = menuItems;
  let currentPath: {item: MenuItemProps; key: string}[] = [];
  let key = '';
  for (let i = 0; i < pathParts.length; ++i) {
    const segment = decodeURIComponent(pathParts[i]);
    const found = items.find(m => m.label.toLowerCase() === segment.toLowerCase());
    if (found) {
      key = key === '' ? segment : `${key}-${segment}`;
      currentPath.push({item: found, key});
      items = found.children || [];
    } else {
      break;
    }
  }
  return currentPath;
}

// Формирование Breadcrumb согласно текущему URL
const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Маппинг path → меню
  const pathToMenuMap: {[url: string]: string[]} = {
    "/": [],
    "/library": ["Библиотека"],
    "/library#books": ["Библиотека", "Книги"],
    "/library#articles": ["Библиотека", "Статьи"],
    "/sport": ["Спорт"],
  };

  // Получаем путь из pathname/hash
  const pathname = location.pathname;
  const hash = location.hash.replace("#","");
  let pathArr: string[];
  if (pathname === "/") pathArr = [];
  else if (pathname === "/library" && hash) pathArr = ["Библиотека", hash === 'books' ? 'Книги' : hash === 'articles' ? 'Статьи' : hash];
  else if (pathname === "/library") pathArr = ["Библиотека"];
  else if (pathname === "/sport") pathArr = ["Спорт"];
  else pathArr = [];

  let cumulativeUrl = "/";
  const crumbLinks = [
    {
      label: "Главная",
      url: "/",
    },
    ...pathArr.map((label, idx) => {
      if (idx === 0) cumulativeUrl = "/library";
      else if (label === "Спорт") cumulativeUrl = "/sport";
      else cumulativeUrl += "";
      if (label === "Книги") cumulativeUrl = "/library#books";
      if (label === "Статьи") cumulativeUrl = "/library#articles";
      return { label, url: cumulativeUrl };
    }),
  ];

  // Для промежуточного меню
  let showChildren: MenuItemProps[] = [];
  if (pathArr.length > 0) {
    // Найти item по активному крошку
    let items = menuItems;
    let found: MenuItemProps | undefined = undefined;
    for (const label of pathArr) {
      found = items.find(i => i.label === label);
      if (found && found.children) items = found.children;
      else items = [];
    }
    if (found && found.children) showChildren = found.children;
  }

  return (
    <div style={{marginBottom:24, marginTop:16}}>
      <Breadcrumb>
        <BreadcrumbList>
          {crumbLinks.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              <BreadcrumbItem>
                {idx < crumbLinks.length-1 ? (
                  <BreadcrumbLink
                    asChild
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      navigate(crumb.url);
                    }}
                    style={{cursor:"pointer"}}
                  >
                    <span>{crumb.label}</span>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx < crumbLinks.length-1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {/* Промежуточные дочерние пункты */}
      {showChildren.length > 0 && (
        <ul className="breadcrumb-children-list" style={{marginTop:10, display:"flex", gap:24, flexWrap:"wrap", justifyContent: "flex-start"}}>
          {showChildren.map(child => (
            <li key={child.label} style={{paddingRight: 8}}>
              <button
                className="breadcrumb-child-btn"
                style={{
                  background: "#1b232e",
                  color: "#4bb6fa",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: "1.06rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 1px 6px #172a3a41"
                }}
                onClick={() => child.onClick && child.onClick(navigate)}
              >
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BreadcrumbNav;

