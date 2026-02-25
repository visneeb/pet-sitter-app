export function UserProfileHeader({
  title,
  action,
  leftAction,
}: {
  title: string;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {leftAction}
        <h3 className="style-headline-3">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function PetSitterProfileHeader({
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
    <div className="flex items-center pr-8 justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {leftAction}
          <h3 className="style-headline-3">{title}</h3>
        </div>
        <span className="stye-body-2">{status}</span>
      </div>
      {action}
    </div>
  );
}
