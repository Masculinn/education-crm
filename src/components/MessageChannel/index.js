import { LayoutCard } from "../layout";
import { LayoutComponent } from "../layout/LayoutComponent";
import { Module } from "./Module";

export default function MessageChannel() {
  return (
    <LayoutCard layoutTitle={"Mesaj Kanalı"}>
      <LayoutComponent isFullWidth isBgRemoved isRemovedPadding>
        <Module />
      </LayoutComponent>
    </LayoutCard>
  );
}
