import { PayoutSummary } from "@/services/api/paymentApi";
import { PaymentList } from "@/types/paymentType";
import { formatTransactionDateWithOutWeekDay } from "@/utils/timeFormat";

const COLS = "grid grid-cols-[0.8fr_0.8fr_2fr_minmax(1rem,auto)]";
const COL_COUNT = 4;

interface PayoutListProps {
  data: PayoutSummary | null;
  isLoading: boolean;
  cols: string;
}

const formatAmount = (amount: string) => `${parseFloat(amount).toFixed(2)} THB`;

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return formatTransactionDateWithOutWeekDay(dateString);
};

const PayoutCard = ({ transaction }: { transaction: PaymentList }) => (
  <div className="sm:hidden flex justify-between items-start py-6 px-4 border-b border-gray-200 text-body-2">
    <div className="flex flex-col gap-1">
      <span className="text-black">{formatDate(transaction.paidAt)}</span>
      <span className="text-black">{transaction.ownerName}</span>
      <span className="text-black text-body-3">
        #{transaction.transactionId}
      </span>
    </div>
    <span className="text-green-500">{formatAmount(transaction.amount)}</span>
  </div>
);

const PayoutRow = ({
  transaction,
  cols,
}: {
  transaction: PaymentList;
  cols: string;
}) => (
  <div
    className={`hidden sm:grid ${cols} py-6 border-b border-gray-200 items-center text-body-2`}
  >
    <span className="px-4 text-black">{formatDate(transaction.paidAt)}</span>
    <span className="px-7 text-black">{transaction.ownerName}</span>
    <span className="px-12 text-black">{transaction.transactionId}</span>
    <span className="px-4 text-green-500">
      {formatAmount(transaction.amount)}
    </span>
  </div>
);

const PayoutSkeleton = ({ cols }: { cols: string }) => (
  <div className="w-full">
    {[...Array(6)].map((_, i) => (
      <div key={i}>
        {/* Mobile skeleton */}
        <div className="sm:hidden flex justify-between items-center py-6 px-4 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
          </div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-16" />
        </div>
        {/* Desktop skeleton */}
        <div className={`hidden sm:grid ${cols} py-5 border-b border-gray-100`}>
          {[...Array(COL_COUNT)].map((_, j) => (
            <div
              key={j}
              className="h-4 bg-gray-100 rounded animate-pulse w-24 mx-4"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const PayoutList = ({ data, isLoading, cols }: PayoutListProps) => {
  if (isLoading) return <PayoutSkeleton cols={cols} />;

  if (!data?.transactions?.length) {
    return (
      <div className="text-gray-400 py-4 text-center">
        No transactions found
      </div>
    );
  }

  return (
    <div className="w-full">
      {data.transactions.map((transaction) => (
        <div key={transaction.transactionId}>
          <PayoutCard transaction={transaction} />
          <PayoutRow transaction={transaction} cols={cols} />
        </div>
      ))}
    </div>
  );
};
