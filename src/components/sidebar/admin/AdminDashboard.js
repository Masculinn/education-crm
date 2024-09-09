import { AppointmentActions } from "@/components/admin/AppointmentActions";
import { Appointments } from "@/components/admin/Appointments";
import RegisterConfirmation from "@/components/admin/RegisterConfirmation";
import { LineChart } from "@/components/admin/charts/LineChart";
import { PieChart } from "@/components/admin/charts/PieChart";
import { CardModal } from "@/components/events/CardModal";
import { LayoutCard } from "@/components/layout";
import { LayoutComponent } from "@/components/layout/LayoutComponent";
import { MyNotes } from "@/components/student/MyNotes";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const { state } = useSelector((state) => state.responsive);
  return (
    <LayoutCard layoutTitle={"Genel"}>
      <LayoutComponent isBgRemoved isRemovedPadding isFullWidth={state}>
        <CardModal />
      </LayoutComponent>
      <LayoutComponent
        isFullWidth={state}
        isRemovedPadding={state}
        isBgRemoved={state}
        styled={`p-2 ${state && "my-4"} `}
      >
        <MyNotes />
      </LayoutComponent>
      <LayoutComponent
        styled={` ${state && "my-4"} col-span-2`}
        isFullWidth
        isGapRemoved={state}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        <RegisterConfirmation />
      </LayoutComponent>
      <LayoutComponent
        styled={state ? "col-span-2 my-4" : "col-span-1"}
        isFullWidth={state}
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <PieChart />
        <LineChart />
      </LayoutComponent>
      <LayoutComponent
        styled={state ? "col-span-2 my-4" : "col-span-1"}
        isFullWidth={state}
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <AppointmentActions />
      </LayoutComponent>
      <LayoutComponent
        styled={`cols-span-2 ${state && "my-4 px-2"}`}
        isFullWidth
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <Appointments />
      </LayoutComponent>
    </LayoutCard>
  );
}
