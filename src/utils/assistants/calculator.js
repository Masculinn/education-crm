const profitPercentageCalc = (curr, prev) => {
  if (prev === 0) return 0;
  const diff = curr - prev;
  return (diff / prev) * 100.0;
};

const profitCalc = (curr, prev, exp) => {
  return curr - (prev + exp);
};

const totalIncoming = (...params) => {
  const sum = params.reduce((a, b) => a + b, 0);
  return sum;
};

export { profitPercentageCalc, profitCalc, totalIncoming };
