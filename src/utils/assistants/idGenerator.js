export default function idGenerator(length, mode) {
  const numbers = "0123456789";
  const letters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJLKZXCVBNM";
  const symbols = "!$&*()-~%#@+=/.><,?|{}[];:";
  let res = "";

  const mixStrings = (a, b) =>
    [...Array(Math.max(a.length, b.length))]
      .map((_, i) => (a[i] || "") + (b[i] || ""))
      .join("");

  switch (mode) {
    case "number":
      for (let i = 0; i < length; i++) {
        res += numbers[Math.floor(Math.random() * numbers.length)];
      }
      return res;

    case "mix":
      const allCharacters = numbers + letters + symbols;
      for (let i = 0; i < length; i++) {
        res += allCharacters[Math.floor(Math.random() * allCharacters.length)];
      }
      return res;

    default:
      const mixed = mixStrings(numbers, letters);
      for (let i = 0; i < length; i++) {
        res += mixed[Math.floor(Math.random() * mixed.length)];
      }
      return res;
  }
}
