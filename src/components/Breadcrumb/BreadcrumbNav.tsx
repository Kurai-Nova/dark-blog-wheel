
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { menuItems } from "../MainMenu/items";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";

// Функция поиска читаемых названий для крошек
function findMenuPath(pathnames: string[]): { label: string, url: string }[] {
  const path: { label: string; url: string }[] = [{ label: "Главная", url: "/" }];
  let items = menuItems;
  let currentUrl = "";

  for (let i = 0; i < pathnames.length; i++) {
    const segment = pathnames[i];
    const nextSegment = pathnames[i + 1];
    const isHashSegment = segment.startsWith("#");

    if (!segment || isHashSegment) continue;

    const combinedSegment = nextSegment?.startsWith("#")
      ? `${segment}${nextSegment}`
      : segment;

    // Поиск в текущем уровне меню
    let found = items.find(item => 
      item.label.toLowerCase() === segment ||
      item.label.toLowerCase() === combinedSegment ||
      (item.url && item.url.replace(/^\//, "") === segment)
    );

    if (!found && segment === "library" && nextSegment?.startsWith("#")) {
      i++;
      found = items.find(item => item.label === "Библиотека");
      if (found) {
        const child = found.children?.find(child =>
          child.label === (nextSegment === "#books" ? "Книги" : "Статьи")
        );
        path.push({ label: found.label, url: `/${segment}` });
        currentUrl = `/${segment}${nextSegment}`;
        if (child) {
          path.push({ label: child.label, url: currentUrl });
        } else {
          path.push({ label: nextSegment.substring(1), url: currentUrl });
        }
        continue;
      }
    }

    currentUrl = currentUrl ? `${currentUrl}/${segment}` : `/${segment}`;

    if (found) {
      // Показываем только читаемый label (никогда алиас)
      path.push({ label: found.label, url: currentUrl });
      if (found.children) items = found.children;
    } else {
      // Не найдено в меню: пишем человекочитаемый вид (например, без алиаса "/" — первая буква заглавная)
      const pretty = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
      path.push({ label: pretty, url: currentUrl });
      items = [];
    }
  }

  return path;
}

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null;

  const segments = location.pathname.split("/").filter(Boolean);
  const hashSegment = location.hash ? [location.hash] : [];
  const crumbLinks = findMenuPath([...segments, ...hashSegment]);

  return (
    <nav style={{ margin: '8px 0' }}>
      <Breadcrumb>
        <BreadcrumbList>
          {crumbLinks.map((crumb, idx) => (
            <React.Fragment key={crumb.label + idx}>
              <BreadcrumbItem>
                {idx < crumbLinks.length - 1 ? (
                  <BreadcrumbLink
                    asChild
                    onClick={e => {
                      e.preventDefault();
                      navigate(crumb.url);
                    }}
                    style={{ cursor: "pointer" }}
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
    </nav>
  );
};

export default BreadcrumbNav;

