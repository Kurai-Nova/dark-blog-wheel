
import React from "react";

// Заглушка для тоастов, совместимая с текущим API, без Radix и shadcn/ui
export const ToastProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} {...props} />
));
ToastViewport.displayName = "ToastViewport";

export const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>{children}</div>
));
Toast.displayName = "Toast";

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Close"
    // Кнопка-заглушка
    style={{
      position: "absolute", right: 2, top: 2, border: "none", background: "transparent", color: "#8891a6", cursor: "pointer"
    }}
    {...props}
  >✕</button>
));
ToastClose.displayName = "ToastClose";

export const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} style={{ fontWeight: "bold", fontSize: "1.1em", marginBottom: "2px" }} {...props}>
    {children}
  </div>
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} style={{ fontSize: "1em", color: "#8891a6" }} {...props}>
    {children}
  </div>
));
ToastDescription.displayName = "ToastDescription";

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <button
    ref={ref}
    style={{
      background: "none",
      color: "#4bb6fa",
      border: "1px solid #4bb6fa",
      borderRadius: 4,
      padding: "2px 10px",
      marginLeft: 14,
      cursor: "pointer"
    }}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";
