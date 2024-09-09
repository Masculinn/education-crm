import viewProfit from "@/utils/db/adminQueries/finance_module/viewProfit";
import { useEffect, useState } from "react";
import { LayoutComponent } from "../layout/LayoutComponent";
import ExpensesChart from "./ExpensesChart";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import { useSelector } from "react-redux";

export const ExpenseGraphs = () => {
  const { state } = useSelector((state) => state.responsive);
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState({
    expenses: [],
    income: [],
  });

  useEffect(() => {
    const processData = (data) => {
      const expenses = Array(12).fill(0);
      const income = Array(12).fill(0);

      data.forEach(({ date, mode, cost }) => {
        const month = new Date(date).getMonth();

        if (mode) income[month] += cost;
        else expenses[month] += cost;
      });

      return { expenses, income };
    };

    const fetchData = async () => {
      setLoading(true);
      const data = await viewProfit("*").finally(() => setLoading(false));
      if (data) {
        const processedData = processData(data);
        setFinancialData(processedData);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <LayoutComponent
        isFullWidth={state}
        styled={`${state && "my-4 px-2 col-span-2"} col-span-1`}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        {loading ? (
          <LoadingSkeleton mode="card" isWidthFull />
        ) : (
          <ExpensesChart data={financialData.income} mode={"profits"} />
        )}
      </LayoutComponent>
      <LayoutComponent
        isFullWidth={state}
        styled={`${state && "my-4 px-2 col-span-2"} col-span-1`}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        {loading ? (
          <LoadingSkeleton mode="card" isWidthFull />
        ) : (
          <ExpensesChart data={financialData.expenses} mode={"expenses"} />
        )}
      </LayoutComponent>
    </>
  );
};
