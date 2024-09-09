import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import viewProfit from "@/utils/db/adminQueries/finance_module/viewProfit";

const Countup = dynamic(() => import("react-countup"), { ssr: false });

const Profit = (props) => {
  const { profit, profitPercentage, incoming, profitComparedToPrevMonth } =
    props;
  return (
    <div className="w-full h-auto items-center justify-center flex lg:flex-row-reverse flex-col-reverse lg:gap-4 gap-2">
      <article className="rounded-lg border  p-6 border-gray-800 bg-gray-900 lg:w-1/2 w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Toplam Kar</p>
            <p className="text-2xl font-medium text-white">
              <Countup start={0} duration={2} end={profit.total} suffix=" €" />
            </p>
          </div>
          <span className="rounded-full bg-blue-100 p-3 bg-blue-500/20 text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>
        <div
          className={`mt-1 flex gap-1 ${
            profitPercentage > 0 ? "text-success-400" : "text-danger-400"
          }`}
        >
          {profitPercentage === 0 ? (
            <></>
          ) : profitPercentage > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          )}

          <p className="flex gap-2 text-xs">
            <span className="font-medium">
              <Countup
                start={0}
                end={profitPercentage}
                prefix=" ~ "
                suffix="%"
              />
            </span>

            <span className="text-gray-400">
              {profitPercentage === 0
                ? "(Önceki Aydan veri bulunamadı)"
                : "(Harcamalarla beraber geçen aya göre)"}
            </span>
          </p>
        </div>
      </article>
      <article className="rounded-lg border  p-6 py-[2.15rem] border-gray-800 bg-gray-900 lg:w-1/2 w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Toplam Kazanç</p>
            <p className="text-2xl font-medium text-white">
              <Countup
                start={0}
                duration={2}
                end={incoming.total}
                suffix=" €"
              />
            </p>
          </div>
          <span className="rounded-full bg-blue-100 p-3 bg-blue-500/20 text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
        </div>
      </article>
    </div>
  );
};

export const Stats = () => {
  const [dataList, setDataList] = useState([]);
  const [status, setStatus] = useState({
    incoming: {
      total: null,
      currMonth: null,
      prevMonth: null,
    },
    expense: {
      total: null,
      currMonth: null,
      prevMonth: null,
    },
    profit: {
      total: null,
      currMonth: null,
      prevMonth: null,
    },
    profitPercentage: null,
  });

  useEffect(() => {
    const getExpenses = async () => {
      const expenses = await viewProfit("*");
      if (expenses) {
        setDataList(expenses);
      }
    };
    getExpenses();
  }, []);

  useEffect(() => {
    if (dataList.length > 0) {
      /* init time data */

      const currDate = new Date();
      const currMonth = currDate.getMonth();
      const currYear = currDate.getFullYear();
      const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
      const prevYear = currMonth === 0 ? currYear - 1 : currYear;

      /* init incoming data */

      const filterIncomingData = dataList.filter((i) => i.mode === true);
      const totalIncomingData = filterIncomingData.map(({ cost }) => cost);
      const totalIncoming = totalIncomingData.reduce((a, b) => a + b, 0);
      const currMonthIncomingData = filterIncomingData
        .filter((i) => {
          const itemDate = new Date(i.date);
          return (
            itemDate.getMonth() === currMonth &&
            itemDate.getFullYear() === currYear
          );
        })
        .map(({ cost }) => cost);

      const prevMonthIncomingData = filterIncomingData
        .filter((i) => {
          const itemDate = new Date(i.date);
          return (
            itemDate.getMonth() === prevMonth &&
            itemDate.getFullYear() === prevYear
          );
        })
        .map(({ cost }) => cost);

      const currMonthIncomingSum = currMonthIncomingData.reduce(
        (a, b) => a + b,
        0
      );
      const prevMonthIncomingSum = prevMonthIncomingData.reduce(
        (a, b) => a + b,
        0
      );

      /* init expense data */

      const filterExpenseData = dataList.filter((i) => i.mode === false);
      const totalExpense = filterExpenseData
        .map(({ cost }) => cost)
        .reduce((a, b) => a + b, 0);

      const currMonthExpenseData = filterExpenseData
        .filter((i) => {
          const itemDate = new Date(i.date);
          return (
            itemDate.getMonth() === currMonth &&
            itemDate.getFullYear() === currYear
          );
        })
        .map(({ cost }) => cost);

      const prevMonthExpenseData = filterExpenseData
        .filter((i) => {
          const itemDate = new Date(i.date);
          return (
            itemDate.getMonth() === prevMonth &&
            itemDate.getFullYear() === prevYear
          );
        })
        .map(({ cost }) => cost);

      const currMonthExpenseSum = currMonthExpenseData.reduce(
        (a, b) => a + b,
        0
      );

      const prevMonthExpenseSum = prevMonthExpenseData.reduce(
        (a, b) => a + b,
        0
      );

      /* init profit data */

      const profit = totalIncoming - totalExpense;
      const currMonthProfit = currMonthIncomingSum - currMonthExpenseSum;
      const prevMonthProfit = prevMonthIncomingSum - prevMonthExpenseSum;

      const profitPercentage =
        prevMonthProfit !== 0 && currMonthProfit !== 0
          ? Math.abs(currMonthProfit) > Math.abs(prevMonthProfit)
            ? Math.floor(
                (_.subtract(
                  Math.abs(currMonthProfit),
                  Math.abs(prevMonthProfit)
                ) /
                  Math.abs(prevMonthProfit)) *
                  100
              )
            : 0
          : 0;

      setStatus({
        incoming: {
          total: totalIncoming,
          currMonth: currMonthIncomingSum,
          prevMonth: prevMonthIncomingSum,
        },
        expense: {
          total: totalExpense,
          currMonth: currMonthExpenseSum,
          prevMonth: prevMonthExpenseSum,
        },
        profit: {
          total: profit,
          currMonth: currMonthProfit,
          prevMonth: prevMonthProfit,
        },
        profitComparedToPrevMonth:
          Math.abs(currMonthProfit) - Math.abs(prevMonthProfit),
        profitPercentage: profitPercentage,
      });
      /* init profit percentage */
      // const profitPercentage = Math.floor(
      //   (currMonthProfit / prevMonthProfit) * 100.0
      // );

      // console.log(profitPercentage);

      // const profitData = dataList.filter((i) => i.mode === true);
      // const totalProfit = profitData.map(({ cost }) => cost);

      // const expenseData = dataList.filter((i) => i.mode === false);
      // const totalExpense = expenseData.map(({ cost }) => cost);

      // const profitDataCurrMonth = dataList.filter((i) => {
      //   const itemDate = new Date(i.date);
      //   return (
      //     i.mode === true &&
      //     itemDate.getMonth() === currMonth &&
      //     itemDate.getFullYear() === currYear
      //   );
      // });

      // const profitDataPrevMonth = dataList.filter((i) => {
      //   const itemDate = new Date(i.date);
      //   return (
      //     i.mode === true &&
      //     itemDate.getMonth() === prevMonth &&
      //     itemDate.getFullYear() === prevYear
      //   );
      // });

      // const expenseDataCurrMonth = dataList.filter((i) => {
      //   const itemDate = new Date(i.date);
      //   return (
      //     i.mode === false &&
      //     itemDate.getMonth() === currMonth &&
      //     itemDate.getFullYear() === currYear
      //   );
      // });

      // const expenseDataPrevMonth = dataList.filter((i) => {
      //   const itemDate = new Date(i.date);
      //   return (
      //     i.mode === false &&
      //     itemDate.getMonth() === (currMonth - 1 < 0 ? 11 : currMonth - 1) &&
      //     itemDate.getFullYear() ===
      //       (currMonth - 1 < 0 ? currYear - 1 : currYear)
      //   );
      // });

      // const totalProfitCurrMonth = profitDataCurrMonth.reduce(
      //   (a, b) => a + b.cost,
      //   0
      // );

      // console.log(profitDataCurrMonth);
      // const totalProfitPrevMonth = profitDataPrevMonth.reduce(
      //   (a, b) => a + b.cost,
      //   0
      // );
      // const totalExpenseCurrMonth = expenseDataCurrMonth.reduce(
      //   (a, b) => a + b.cost,
      //   0
      // );
      // const totalExpensePrevMonth = expenseDataPrevMonth.reduce(
      //   (a, b) => a + b.cost,
      //   0
      // );

      // const updatedPercentage = profitPercentageCalc(
      //   totalProfitCurrMonth,
      //   totalProfitPrevMonth,
      //   totalExpensePrevMonth + totalExpenseCurrMonth
      // );

      // const totalValue = totalIncoming(...totalProfit);
      // const totalExpenseValue = totalIncoming(...totalExpense);
      // console.log(`
      //   Profit: ${totalValue}
      //   Expense: ${totalExpenseValue}
      //   Profit percentage: ${updatedPercentage}
      //   Profit curr month: ${totalProfitCurrMonth}
      //   Profit prev month: ${totalProfitPrevMonth}
      //   Expense curr month: ${totalExpenseCurrMonth}
      //   Expense prev month: ${totalExpensePrevMonth}
      //   `);
      // setStatus({
      //   expense: {
      //     total: totalExpenseValue,
      //     currMonth: totalExpenseCurrMonth,
      //     prevMonth: totalExpensePrevMonth,
      //   },
      //   profit: {
      //     total: totalValue,
      //     currMonth: totalProfitCurrMonth,
      //     prevMonth: totalProfitPrevMonth,
      //   },
      //   profitPercentage: updatedPercentage,
      // });
    }
  }, [dataList]);

  return (
    <main className="w-full h-full">
      <Profit {...status} />
    </main>
  );
};
