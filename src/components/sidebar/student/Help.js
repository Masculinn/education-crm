import React from "react";
import { LayoutCard } from "../../layout";
import { LayoutComponent } from "../../layout/LayoutComponent";
import { Feedback } from "../../Feedback";

export default function Help() {
  return (
    <LayoutCard layoutTitle={"Yardım"}>
      <LayoutComponent isBgRemoved isFullWidth isRemovedPadding isGapRemoved>
        <Feedback />
      </LayoutComponent>
    </LayoutCard>
  );
}

export { Help };
