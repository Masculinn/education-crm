import React from "react";
import { LayoutCard } from "../../layout";
import { LayoutComponent } from "../../layout/LayoutComponent";
import { MySchool } from "../../student/MySchool";
import { CardModal } from "../../events/CardModal";
import { MyNotes } from "../../student/MyNotes";
import { MyMentor } from "../../student/MyMentor";
import { MyAppointments } from "../../student/MyAppointments";
import { useSelector } from "react-redux";

export default function StudentDashMain() {
  const { state } = useSelector((state) => state.responsive);
  return (
    <React.Fragment>
      <LayoutCard layoutTitle={"Genel"}>
        <LayoutComponent isFullWidth isRemovedPadding isBgRemoved>
          <MySchool />
        </LayoutComponent>
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
          isFullWidth={state}
          isRemovedPadding={state}
          isBgRemoved={state}
          styled={`p-2 ${state && "my-4"} `}
        >
          <MyMentor />
        </LayoutComponent>
        <LayoutComponent
          isFullWidth={state}
          isRemovedPadding={state}
          isBgRemoved={state}
          styled={` p-2 ${state && "my-4"} `}
        >
          <MyAppointments />
        </LayoutComponent>
      </LayoutCard>
    </React.Fragment>
  );
}
