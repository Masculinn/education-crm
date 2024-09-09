export const processStudentData = (data) => {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const monthlyCounts = Array(12).fill(0);

  data.forEach((student) => {
    const date = new Date(student.created_at);
    const month = date.getMonth();
    monthlyCounts[month]++;
  });

  return {
    labels: months,
    data: monthlyCounts,
  };
};
