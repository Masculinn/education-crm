import React from "react";
import { LayoutCard } from "../../layout";
import { LayoutComponent } from "../../layout/LayoutComponent";
import { useSelector } from "react-redux";
import { DocumentActions } from "../../utils/DocumentActions";
import { MyProfile } from "../../student/MyProfile";
import MyDocuments from "../../student/MyDocuments";

export default function StudentDocumentManager() {
  const { id } = useSelector((state) => state.login);
  const { state } = useSelector((state) => state.responsive);

  return (
    <React.Fragment>
      <LayoutCard layoutTitle={"Dökümanlarım"}>
        <LayoutComponent isFullWidth isRemovedPadding isBgRemoved={state}>
          <DocumentActions />
        </LayoutComponent>
        <LayoutComponent
          isFullWidth={state}
          isRemovedPadding={state}
          isBgRemoved={state}
          styled={`p-2 ${state && "my-4"} `}
        >
          <MyProfile />
        </LayoutComponent>
        <LayoutComponent
          isFullWidth={state}
          isRemovedPadding={state}
          isBgRemoved={state}
          styled={`p-2 ${state && "-mt-4"} `}
        >
          <MyDocuments />
        </LayoutComponent>
      </LayoutCard>
    </React.Fragment>
  );
}
