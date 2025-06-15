
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
import BreadcrumbChildrenList from "./BreadcrumbChildrenList";

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const hash = location.hash.replace("#", "");

  // Не отображать Breadcrumb на главной странице
  if (pathname === "/") return null;

  let pathArr: string[];
  if (pathname === "/library" && hash) {
    // hash может быть books или articles
    pathArr = ["Библиотека", hash === 'books' ? 'Книги' : hash === 'articles' ? 'Статьи' : hash];
  } else if (pathname === "/library") {
    pathArr = ["Библиотека"];
  } else if (pathname === "/sport") {
    pathArr = ["Спорт"];
  } else {
    pathArr = [];
  }

  // Формируем ссылки breadcrumb
  let cumulativeUrl = "/";
  const crumbLinks = [
    {
      label: "Главная",
      url: "/",
    },
    ...pathArr.map((label, idx) => {
      if (idx === 0) cumulativeUrl = label === "Библиотека" ? "/library" : label === "Спорт" ? "/sport" : "/";
      if (label === "Книги") cumulativeUrl = "/library#books";
      if (label === "Статьи") cumulativeUrl = "/library#articles";
      return { label, url: cumulativeUrl };
    }),
  ];

  // Определяем текущий уровень и детей для промежуточной навигации
  let showChildren: MenuItemProps[] = [];
  if (pathArr.length > 0) {
    let items = menuItems;
    let found: MenuItemProps | undefined;
    for (const label of pathArr) {
      found = items.find(i => i.label === label);
      if (found && found.children) {
        items = found.children;
      } else {
        items = [];
      }
    }
    if (found && found.children) showChildren = found.children;
  }

  return (
    <div style={{marginBottom:16, marginTop:8}}>
      <Breadcrumb>
        <BreadcrumbList>
          {crumbLinks.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              <BreadcrumbItem>
                {idx < crumbLinks.length - 1 ? (
                  <BreadcrumbLink
                    asChild
                    onClick={e => {
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
              {idx < crumbLinks.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {showChildren.length > 0 && (
        <BreadcrumbChildrenList items={showChildren} navigate={navigate} />
      )}
    </div>
  );
};

export default BreadcrumbNav;
