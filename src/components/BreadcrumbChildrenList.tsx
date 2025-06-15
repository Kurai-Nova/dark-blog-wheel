
import React from "react";
import { MenuItemProps } from "./MainMenu/items";

interface BreadcrumbChildrenListProps {
  items: MenuItemProps[];
  navigate: (to: string) => void;
}

const BreadcrumbChildrenList: React.FC<BreadcrumbChildrenListProps> = ({ items, navigate }) => (
  <ul
    className="breadcrumb-children-list"
    style={{
      marginTop: 8,
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      justifyContent: "flex-start",
      fontSize: "1.03rem"
    }}
  >
    {items.map(child => (
      <li key={child.label}>
        <button
          className="breadcrumb-child-btn"
          style={{
            background: "#1b232e",
            color: "#4bb6fa",
            border: "none",
            borderRadius: 6,
            padding: "7px 16px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 1px 6px #172a3a33"
          }}
          onClick={() => child.onClick && child.onClick(navigate)}
        >
          {child.label}
        </button>
      </li>
    ))}
  </ul>
);

export default BreadcrumbChildrenList;
