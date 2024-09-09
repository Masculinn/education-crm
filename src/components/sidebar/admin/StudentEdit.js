import { EditStudent } from "@/components/admin/EditStudent";
import { LayoutCard } from "@/components/layout";
import { LayoutComponent } from "@/components/layout/LayoutComponent";

export default function StudentEdit() {
  return (
    <LayoutCard layoutTitle={"Öğrenci Edit"}>
      <LayoutComponent
        styled={"col-span-2  -mx-4"}
        isBgRemoved
        isFullWidth
        isGapRemoved
        isRemovedPadding
      >
        <EditStudent />
      </LayoutComponent>
    </LayoutCard>
  );
}
