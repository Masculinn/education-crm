import { LineChart } from "@/components/admin/charts/LineChart";
import { PieChart } from "@/components/admin/charts/PieChart";
import { StudentCard } from "@/components/admin/StudentCard";
import { StudentManagement } from "@/components/admin/StudentManagement";
import { LayoutCard } from "@/components/layout";
import { LayoutComponent } from "@/components/layout/LayoutComponent";
import { useSelector } from "react-redux";

export default function StudentManager() {
  const { state } = useSelector((state) => state.responsive);

  return (
    <LayoutCard layoutTitle={"Öğrenci Genel"}>
      <LayoutComponent
        isFullWidth={state}
        styled={`${state && "my-4 px-2"} col-span-2`}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        <PieChart />
      </LayoutComponent>
      <LayoutComponent
        isFullWidth={state}
        styled={`${state && "my-4 px-2"} col-span-2`}
        isRemovedPadding={state}
        isBgRemoved={state}
      >
        <LineChart />
      </LayoutComponent>

      <LayoutComponent
        isFullWidth
        styled={`cols-span-2 ${state && "my-4 px-2"}`}
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <StudentManagement
          scrollToStudentCard={() => {
            document.getElementById("student_card").scrollIntoView({
              behavior: "smooth",
            });
          }}
        />
      </LayoutComponent>
      <LayoutComponent
        isFullWidth
        styled={`cols-span-2 ${state && "my-4 "}`}
        isBgRemoved={state}
        isRemovedPadding={state}
      >
        <StudentCard />
      </LayoutComponent>
    </LayoutCard>
  );
}
