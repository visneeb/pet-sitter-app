"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "@/assets/icons/components";
import { usePagination } from "@/hooks/usePagination";

interface PaginationProps {
  /** จำนวนหน้าทั้งหมด (มักได้จาก API response) - default 100 สำหรับ demo */
  totalPages?: number;
  /** Controlled: หน้าปัจจุบัน (มักได้จาก API response) */
  currentPage?: number;
  /** Controlled: callback เมื่อเปลี่ยนหน้า - ให้ parent fetch ข้อมูลใหม่ */
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  totalPages = 100,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const {
    currentPage: page,
    totalPages: total,
    pageNumbers,
    handlePageClick,
  } = usePagination({
    totalPages,
    currentPage,
    onPageChange,
  });

  return (
    <div className="w-full flex justify-center pt-6 pb-[196px]">
      <div className="flex justify-center items-center gap-2 ">
        <button
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:cursor-pointer transition
            ${page === 1 && "disabled:cursor-default"}`}
        >
          <ArrowLeftIcon />
        </button>

        {pageNumbers.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-gray-400"
              >
                …
              </span>
            );
          }
          return (
            <button
              key={item}
              onClick={() => handlePageClick(item)}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-[16px] hover:bg-gray-100 hover:cursor-pointer transition-all duration-300
                ${page === item ? "bg-orange-100 text-orange-600 hover:bg-orange-100 disabled:cursor-default" : "bg-white text-gray-300 hover:bg-gray-100"}
                `}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => handlePageClick(page + 1)}
          disabled={page === total}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100  hover:cursor-pointer transition
    ${page === total && "disabled:cursor-default"}`}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};
