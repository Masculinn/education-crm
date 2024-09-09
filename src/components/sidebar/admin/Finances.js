import { ExpenseGraphs } from "@/components/FinanceManagement/ExpenseGraphs";
import { FinanceTable } from "@/components/FinanceManagement/FinancesTable";
import { Reports } from "@/components/FinanceManagement/Reports";
import { Stats } from "@/components/FinanceManagement/Stats";
import { LayoutCard } from "@/components/layout";
import { LayoutComponent } from "@/components/layout/LayoutComponent";
import { useSelector } from "react-redux";

export default function Finance() {
  const { state } = useSelector((state) => state.responsive);
  return (
    <LayoutCard layoutTitle={"Finans"}>
      <LayoutComponent isFullWidth isBgRemoved isRemovedPadding>
        <Stats />
      </LayoutComponent>
      <ExpenseGraphs />
      <LayoutComponent
        isFullWidth
        styled={`${state && "my-4 px-2"} col-span-2`}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        <Reports />
      </LayoutComponent>
      <LayoutComponent
        isFullWidth
        styled={`cols-span-2 ${state && "my-4 px-2"}`}
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <FinanceTable />
      </LayoutComponent>
    </LayoutCard>
  );
}
