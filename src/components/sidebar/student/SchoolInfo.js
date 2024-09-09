import React from "react";
import { LayoutCard } from "../../layout";
import { LayoutComponent } from "../../layout/LayoutComponent";
import { MySchool } from "../../student/MySchool";
import { MySchoolNotes } from "../../student/MySchoolNotes";

export default function SchoolInfo() {
  return (
    <>
      <LayoutCard layoutTitle={"Okulum"}>
        <LayoutComponent isFullWidth isBgRemoved isRemovedPadding>
          <MySchool />
        </LayoutComponent>
        <LayoutComponent isFullWidth isBgRemoved isRemovedPadding>
          <MySchoolNotes />
        </LayoutComponent>
      </LayoutCard>
    </>
  );
}
