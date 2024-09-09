import { EventManager } from "@/components/EventManager";
import { LayoutCard } from "@/components/layout";
import { LayoutComponent } from "@/components/layout/LayoutComponent";

export default function Events() {
  return (
    <LayoutCard layoutTitle={"Etkinlikler"}>
      <LayoutComponent isBgRemoved isRemovedPadding styled={"col-span-2 my-8"}>
        <EventManager />
      </LayoutComponent>
    </LayoutCard>
  );
}
