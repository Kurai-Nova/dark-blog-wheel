
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

// Helper to turn Latin slugs into nice Russian labels, if possible
function getPrettyLabel(segment: string, possibleLabel?: string) {
  if (possibleLabel) return possibleLabel;
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}

// Функция поиска читаемых названий для крошек без использования item.url
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

    // Найдём пункт меню по сегменту — ищем по label, с учётом регистра
    let found = items.find(item =>
      item.label.toLowerCase() === segment ||
      item.label.toLowerCase() === combinedSegment
    );

    // Спец. обработка для библиотечных дочерних элементов с #hash (Книги/Статьи)
    if (!found && segment === "library" && nextSegment?.startsWith("#")) {
      i++;
      found = items.find(item => item.label === "Библиотека");
      if (found) {
        const child = found.children?.find(child =>
          child.label === (nextSegment === "#books" ? "Книги" :
                      nextSegment === "#articles" ? "Статьи" : null)
        );
        path.push({ label: found.label, url: `/library` });
        currentUrl = `/library${nextSegment}`;
        if (child) {
          path.push({ label: child.label, url: currentUrl });
        } else {
          path.push({ label: getPrettyLabel(nextSegment.substring(1)), url: currentUrl });
        }
        continue;
      }
    }

    // Правильно собираем currentUrl для хлебных крошек
    currentUrl = currentUrl ? `${currentUrl}/${segment}` : `/${segment}`;

    if (found) {
      path.push({ label: found.label, url: currentUrl });
      if (found.children) items = found.children;
    } else {
      // Не найдено — красивый fallback
      const pretty = getPrettyLabel(segment);
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
