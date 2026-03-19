"use client";

export function UserProfileHeader({
  title,
  action,
  leftAction,
}: {
  title: string | React.ReactNode;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {leftAction}
        <h3 className="style-headline-4 md:style-headline-3">{title}</h3>
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
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center justify-between px-4 lg:px-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {leftAction}
          <h3 className="style-headline-4 md:style-headline-3">{title}</h3>
        </div>
        <span className="style-body-1 md:style-body-2">{status}</span>
      </div>
      <div className="flex items-center md:justify-end justify-start">
        {action}
      </div>
    </div>
  );
}
