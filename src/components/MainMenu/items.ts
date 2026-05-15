export type MenuItemProps = {
  label: string;
  onClick?: (navigate?: (path: string) => void) => void;
  children?: MenuItemProps[];
};

export const menuItems: MenuItemProps[] = [
  {
    label: "Здоровье",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/health") : window.location.href = "/health",
  },
  {
    label: "Спорт",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/sport") : window.location.href = "/sport",
  },
  {
    label: "Заметки",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/notes") : window.location.href = "/notes",
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
