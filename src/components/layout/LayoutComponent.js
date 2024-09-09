import React from "react";

const LayoutComponent = ({
  children,
  styled,
  isBgRemoved,
  isRemovedPadding,
  isFullWidth,
  isGapRemoved,
}) => {
  return (
    <React.Fragment>
      <div
        className={`w-auto ${!isBgRemoved && "bg-slate-900/25"}  rounded-xl ${
          !isRemovedPadding && "p-8"
        }  items-center flex justify-center flex-col ${
          !isGapRemoved && "gap-4"
        }  ${styled} ${isFullWidth && "col-span-2"} `}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export { LayoutComponent };
