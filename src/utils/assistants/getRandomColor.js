export default function getRandomColor() {
  const colors = [
    "#FF0000",
    "#FF7F00",
    "#A3E635",
    "#00FF00",
    "#20B2AA",
    "#00BFFF",
    "#4B0082",
    "#FF69B4",
    "#FF007F",
    "#FFFFFF",
  ];
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}
