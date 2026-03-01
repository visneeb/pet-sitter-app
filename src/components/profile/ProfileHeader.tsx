"use client";

import useScreen from "@/hooks/useScreen";

export function UserProfileHeader({
  title,
  action,
  leftAction,
}: {
  title: string;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
}) {
  const screen = useScreen();
  const isMediumScreen = screen.isMedium;
  const titleClassName = isMediumScreen
    ? "style-headline-3"
    : "style-headline-4";
  return (
    <div className="flex items-center justify-between px-4 lg:px-0">
      <div className="flex items-center gap-2">
        {leftAction}
        <h3 className={`${titleClassName}`}>{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function ActionProfileHeader({
  title,
  status,
  action,
  leftAction,
}: {
  title: string;
  status?: React.ReactNode;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
}) {
  const screen = useScreen();
  const isMediumScreen = screen.isMedium;
  const titleClassName = isMediumScreen
    ? "style-headline-3"
    : "style-headline-4";
  const statusClassName = isMediumScreen ? "style-body-2" : "style-body-1";

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center justify-between px-4 lg:px-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {leftAction}
          <h3 className={`${titleClassName}`}>{title}</h3>
        </div>
        <span className={`${statusClassName}`}>{status}</span>
      </div>
      <div className="flex items-center md:justify-end justify-start">
        {action}
      </div>
    </div>
  );
}
