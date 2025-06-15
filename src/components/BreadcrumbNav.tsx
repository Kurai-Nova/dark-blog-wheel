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
import { menuItems } from "./MainMenu/items";

function findMenuPath(pathnames: string[]): { label: string, url: string }[] {
  const path: { label: string; url: string }[] = [{ label: "Главная", url: "/" }];
  let items = menuItems;
  let currentUrl = "";

  for (let i = 0; i < pathnames.length; i++) {
    const segment = pathnames[i];
    const nextSegment = pathnames[i + 1];
    const isHashSegment = segment.startsWith("#");

    // Пропускаем пустые и хэш-сегменты (обрабатываются вместе с родителем)
    if (!segment || isHashSegment) continue;

    const combinedSegment = nextSegment?.startsWith("#")
      ? `${segment}${nextSegment}`
      : segment;

    // Поиск в текущем уровне меню
    let found = items.find(item =>
      item.label.toLowerCase() === segment ||
      item.label.toLowerCase() === combinedSegment
    );

    if (!found && segment === "library" && nextSegment?.startsWith("#")) {
      // Специальная обработка для библиотеки с хэшем
      i++; // Пропускаем хэш-сегмент
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

    // Обновляем URL
    currentUrl = currentUrl ? `${currentUrl}/${segment}` : `/${segment}`;

    if (found) {
      path.push({ label: found.label, url: currentUrl });
      if (found.children) items = found.children;
    } else {
      path.push({ label: segment, url: currentUrl });
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
