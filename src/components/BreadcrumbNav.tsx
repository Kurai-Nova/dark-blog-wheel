
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

function findMenuPath(pathnames: string[]): { label: string, url: string }[] {
  // Построим путь из menuItems основываясь на route-структуре и хэше
  const path: { label: string; url: string }[] = [{ label: "Главная", url: "/" }];
  let items = menuItems;
  let url = "";
  for (let i = 0; i < pathnames.length; i++) {
    const isHashLib = pathnames[i] === "library" && pathnames[i + 1]?.startsWith("#");
    let segment = pathnames[i];
    if (isHashLib) {
      // library#books, library#articles и т.д.
      segment += pathnames[i + 1];
      i++; // skip next
    }
    // Поиск по label
    let found: MenuItemProps | undefined;
    if (segment.startsWith("library")) {
      found = items.find(it => it.label === "Библиотека");
      url = "/library";
      // try to extract hash-children
      if (segment === "library#books" || segment === "#books") {
        url = "/library#books";
        found = (found?.children || []).find(it => it.label === "Книги") || found;
        path.push({ label: "Библиотека", url: "/library" });
        path.push({ label: "Книги", url });
        continue;
      }
      if (segment === "library#articles" || segment === "#articles") {
        url = "/library#articles";
        found = (found?.children || []).find(it => it.label === "Статьи") || found;
        path.push({ label: "Библиотека", url: "/library" });
        path.push({ label: "Статьи", url });
        continue;
      }
      path.push({ label: found?.label || segment, url });
      continue;
    }
    if (segment === "sport") {
      found = items.find(it => it.label === "Спорт");
      url = "/sport";
      path.push({ label: "Спорт", url });
      continue;
    }
    found = items.find(it => it.label.toLowerCase() === segment); // поиск по label
    if (found) {
      url = found?.children ? url : `/${segment}`;
      path.push({ label: found.label, url });
      if (found.children) items = found.children;
    } else {
      // не найдено, просто slug-сегмент
      url = url + "/" + segment;
      path.push({ label: segment, url });
    }
  }
  // Фильтрация дубликатов (бывает при library)
  return path.filter((p, i, arr) => i === 0 || arr[i].label !== arr[i - 1].label);
}

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null;

  const segments = location.pathname.split("/").filter(Boolean);

  // Добавляем hash как отдельный сегмент (например #books для /library)
  let hashSegment = location.hash ? [location.hash] : [];
  const pathArr = [...segments, ...hashSegment];
  const crumbLinks = findMenuPath(pathArr);

  return (
    <nav style={{margin:'8px 0'}}>
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
