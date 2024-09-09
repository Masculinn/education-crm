const colorSet = (val) => {
  return val === true || val === "true"
    ? "success"
    : val === undefined || val === null
    ? "warning"
    : "danger";
};

export { colorSet };
