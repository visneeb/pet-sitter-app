import { useMemo, useState } from "react";

export type PaginationItem = number | "ellipsis";

interface UsePaginationOptions {
  totalPages?: number;
  /** Controlled: หน้าปัจจุบันจาก parent (เช่นจาก API response) */
  currentPage?: number;
  /** Controlled: callback เมื่อผู้ใช้เปลี่ยนหน้า - parent ควร fetch ข้อมูลใหม่แล้วอัปเดต state */
  onPageChange?: (page: number) => void;
  /** Uncontrolled: หน้าเริ่มต้น (ใช้เมื่อไม่ได้ส่ง currentPage/onPageChange) */
  initialPage?: number;
  /** จำนวนหน้าที่โชว์ข้างๆ หน้าปัจจุบัน */
  siblingCount?: number;
}

/**
 * สร้าง array ของหมายเลขหน้าที่ต้องแสดง พร้อม "ellipsis" ตำแหน่งที่ต้องใส่ "..."
 *
 * Logic (100 หน้า):
 * - หน้า 1-2:  1, 2, 3, ..., 98, 99, 100
 * - หน้า 3:    1, 2, 3, 4, ..., 99, 100
 * - หน้ากลาง: 1, ..., curr-1, curr, curr+1, ..., 100
 * - หน้า 98-100: 1, 2, ..., 97, 98, 99, 100
 */
function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    const result: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      result.push(i + 1);
    }
    return result;
  }

  const pagesToShow = new Set<number>();

  if (currentPage <= 2) {
    // หน้า 1-2: 1, 2, 3, ..., 98, 99, 100
    for (let i = 1; i <= 3; i++) pagesToShow.add(i);
    for (let i = totalPages - 2; i <= totalPages; i++) pagesToShow.add(i);
  } else if (currentPage === 3) {
    // หน้า 3: 1, 2, 3, 4, ..., 99, 100
    for (let i = 1; i <= 4; i++) pagesToShow.add(i);
    for (let i = totalPages - 1; i <= totalPages; i++) pagesToShow.add(i);
  } else if (currentPage === totalPages - 2) {
    // หน้า 98: 1, 2, ..., 97, 98, 99, 100
    for (let i = 1; i <= 2; i++) pagesToShow.add(i);
    for (let i = totalPages - 3; i <= totalPages; i++) pagesToShow.add(i);
  } else if (currentPage >= totalPages - 1) {
    // หน้า 99 หรือ 100: 1, 2, 3, ..., 98, 99, 100 (เหมือนหน้า 1-2)
    for (let i = 1; i <= 3; i++) pagesToShow.add(i);
    for (let i = totalPages - 2; i <= totalPages; i++) pagesToShow.add(i);
  } else {
    // หน้ากลาง: 1, ..., curr-1, curr, curr+1, ..., 100
    pagesToShow.add(1);
    pagesToShow.add(totalPages);
    pagesToShow.add(currentPage - siblingCount);
    pagesToShow.add(currentPage);
    pagesToShow.add(currentPage + siblingCount);
  }

  const sorted = Array.from(pagesToShow).sort((a, b) => a - b);
  const result: PaginationItem[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }

  return result;
}

export function usePagination(options: UsePaginationOptions) {
  const {
    totalPages: totalPagesCount = 100,
    currentPage: controlledPage,
    onPageChange,
    initialPage = 1,
    siblingCount = 1,
  } = options;

  const [internalPage, setInternalPage] = useState(initialPage);

  const isControlled = controlledPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const pageNumbers = useMemo(
    () => getVisiblePageNumbers(currentPage, totalPagesCount, siblingCount),
    [currentPage, totalPagesCount, siblingCount],
  );

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPagesCount) return;
    if (isControlled) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  return {
    currentPage,
    totalPages: totalPagesCount,
    pageNumbers,
    handlePageClick,
  };
}
