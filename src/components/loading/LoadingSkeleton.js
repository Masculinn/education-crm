import { Skeleton, Card } from "@nextui-org/react";

export const LoadingSkeleton = ({
  mode,
  textLine,
  maxW,
  isWidthFull,
  h,
  style,
  repeat,
}) => {
  switch (mode) {
    case "card":
      return (
        <Card
          className={` ${style} w-full space-y-5 p-4 dark ${
            h ? `h-[${h}px]` : "h-full"
          }`}
          radius="lg"
        >
          <Skeleton className="rounded-lg dark">
            <div className="h-48 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg dark">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg dark">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg dark">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      );
    case "half_card":
      return (
        <Card
          className={` ${style} w-1/2 space-y-5 p-4 dark ${
            h ? `h-[${h}px]` : "h-full"
          }`}
          radius="lg"
        >
          <Skeleton className="rounded-lg dark">
            <div className="h-48 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg dark">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg dark">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg dark">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      );
    case "text":
      return Array.from({ length: repeat ?? 2 })?.map((_, kx) => (
        <div
          key={kx}
          className={`${kx !== 0 && "mt-4"} ${style} ${
            isWidthFull && "w-full"
          } max-w-[${maxW ?? "300px"}] flex flex-col gap-2`}
        >
          {Array.from({ length: textLine })?.map((_, idx) => (
            <Skeleton
              key={idx}
              className={`h-3 w-${idx + 3}/5 rounded-lg dark`}
            />
          ))}
        </div>
      ));
    case "label":
      return Array.from({ length: repeat ?? 1 })?.map((_, kx) => (
        <div
          key={kx}
          className={`${style} ${kx !== 0 && "mt-4"} max-w-[${
            maxW ? maxW : "300px"
          }] ${isWidthFull && "w-full"}  flex items-center gap-3`}
        >
          <div>
            <Skeleton className="flex rounded-full w-12 h-12 dark" />
          </div>
          <div className="w-full flex flex-col gap-2">
            {Array.from({ length: textLine })?.map((_, idx) => (
              <Skeleton
                className={`h-3 w-${idx + 3}/5 rounded-lg dark`}
                key={idx}
              />
            ))}
          </div>
        </div>
      ));
    case "table":
      return (
        <div className={`w-full h-96 bg-transparent rounded-xl`}>
          <div className="w-full h-2/5 items-center justify-between flex flex-row px-4">
            <Skeleton className="dark w-1/2 h-12 rounded-full " />
            <div className="w-2/5 items-center justify-end flex flex-row gap-4">
              <Skeleton className="dark w-1/3 h-12 rounded-2xl" />
              <Skeleton className="dark w-1/3 h-12 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="w-auto px-12 flex self-center h-3/5 dark rounded-xl -mt-6" />
        </div>
      );
    default:
      return;
  }
};
