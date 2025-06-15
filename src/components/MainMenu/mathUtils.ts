// Преобразование градусов в радианы
export const degToRad = (degrees: number): number =>
  degrees * (Math.PI / 180);

// Вычисление координат точки на окружности
export const getCirclePosition = (
  centerX: number,
  centerY: number,
  radius: number,
  angleDegrees: number
): [number, number] => {
  const angleRadians = degToRad(angleDegrees);
  return [
    centerX + radius * Math.cos(angleRadians),
    centerY + radius * Math.sin(angleRadians)
  ];
};

// Расчет угла для элементов меню
export const getItemAngle = (
  index: number,
  totalItems: number,
  startAngle: number
): number =>
  (360 / totalItems) * index + startAngle;
