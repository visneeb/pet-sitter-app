# 🔧 FilterSidebar Refactoring Guide

> **ไฟล์เป้าหมาย:** `src/components/search/FilterSideBar.tsx`  
> **วันที่:** 2026-02-22  
> **วัตถุประสงค์:** ปรับปรุงโค้ดให้ได้มาตรฐาน Production-level ตามหลัก Software Engineering

---

## 📋 สารบัญ

1. [สรุปปัญหาที่พบ (Code Smells)](#1-สรุปปัญหาที่พบ-code-smells)
2. [วิธี Refactor ที่แนะนำ](#2-วิธี-refactor-ที่แนะนำ)
3. [ตาราง Trade-off เปรียบเทียบ](#3-ตาราง-trade-off-เปรียบเทียบ)
4. [วิธีที่ดีที่สุด + โค้ดตัวอย่างเต็ม](#4-วิธีที่ดีที่สุด--โค้ดตัวอย่างเต็ม)

---

## 1. สรุปปัญหาที่พบ (Code Smells)

| # | ปัญหา | หลักการที่ละเมิด | ผลกระทบ |
|---|--------|------------------|---------|
| 1 | `useState` แยก 4 ตัวสำหรับ filter เดียวกัน | **Cohesion** — state ที่เกี่ยวข้องกันควรอยู่ด้วยกัน | reset ต้องเรียก setter ทีละตัว, ง่ายต่อการ bug |
| 2 | Handler functions ทุกตัวแค่เรียก setter ตรงๆ | **YAGNI / DRY** — wrapper function ที่ไม่เพิ่มคุณค่า | เพิ่ม LOC โดยไม่จำเป็น |
| 3 | Magic string `"0-2 Years"` ซ้ำ 2 ที่ | **DRY / Single Source of Truth** | เปลี่ยนค่าต้องแก้หลายที่ |
| 4 | Dead code comments (บรรทัด 9-11) | **Clean Code** | ทำให้โค้ดรก อ่านยาก |
| 5 | `console.log` ใน `handleSearch` | **Production readiness** | ไม่ควรมี log ใน production |
| 6 | `FilterActions` รับ filter state ทั้ง 4 ตัว แต่ไม่ได้ใช้ | **Interface Segregation** | prop drilling ที่ไม่จำเป็น |
| 7 | ไม่มี Type กลาง สำหรับ filter state | **Type safety / DRY** | ทุก component ต้อง define type ซ้ำ |
| 8 | Component ไม่รับ callback จาก parent | **Reusability** — ข้อมูลติดอยู่ใน component | parent ไม่สามารถใช้ค่า filter ได้ |

---

## 2. วิธี Refactor ที่แนะนำ

### วิธีที่ 1: Grouped State Object (useState กลุ่มเดียว)

**แนวคิด:** รวม state ทั้ง 4 ตัวเป็น object เดียว + สร้าง updater function กลาง

```tsx
// ❌ ก่อน
const [searchText, setSearchText] = useState("");
const [petTypes, setPetTypes] = useState<string[]>([]);
const [rating, setRating] = useState<number[]>([]);
const [experience, setExperience] = useState("0-2 Years");

// ✅ หลัง
const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
  setFilters(prev => ({ ...prev, [key]: value }));
};
```

**✅ ข้อดี:**

- Reset ง่าย: `setFilters(DEFAULT_FILTERS)` บรรทัดเดียว
- เพิ่ม filter ใหม่ง่าย — แค่เพิ่ม key ใน type
- ส่ง filter object ทั้งก้อนไป API ได้เลย

**❌ ข้อเสีย:**

- Update ต้อง spread object (shallow copy ทุกครั้ง)
- ถ้า filter มี logic ซับซ้อน ฟังก์ชัน `updateFilter` อาจไม่พอ
- Child component ต้องปรับ callback signature

---

### วิธีที่ 2: useReducer (Reducer Pattern)

**แนวคิด:** ใช้ `useReducer` เพื่อจัดการ state transitions ผ่าน actions

```tsx
type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PET_TYPES"; payload: string[] }
  | { type: "SET_RATING"; payload: number[] }
  | { type: "SET_EXPERIENCE"; payload: string }
  | { type: "RESET" };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchText: action.payload };
    case "SET_PET_TYPES":
      return { ...state, petTypes: action.payload };
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_EXPERIENCE":
      return { ...state, experience: action.payload };
    case "RESET":
      return DEFAULT_FILTERS;
  }
}
```

**✅ ข้อดี:**

- State transitions ชัดเจน, trace ง่าย (ดูว่า action อะไรเปลี่ยน state)
- เหมาะกับ state ที่มี business logic ซับซ้อน
- Test reducer แยกได้ง่าย (pure function)

**❌ ข้อเสีย:**

- Boilerplate มากกว่า useState (ต้องเขียน action types + reducer)
- สำหรับ filter ง่ายๆ 4 ตัว อาจ **over-engineering**
- ต้อง dispatch action แทนการ set ค่าตรงๆ → เรียนรู้เพิ่ม

---

### วิธีที่ 3: Custom Hook (useFilterState)

**แนวคิด:** แยก state logic ออกมาเป็น custom hook เพื่อ reuse + testability

```tsx
function useFilterState(initialState: FilterState = DEFAULT_FILTERS) {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }, []
  );

  const resetFilters = useCallback(() => setFilters(initialState), [initialState]);

  return { filters, updateFilter, resetFilters } as const;
}
```

**✅ ข้อดี:**

- **Separation of Concerns** — UI กับ Logic แยกกัน
- Reusable (ใช้ได้กับ filter sidebar อื่น)
- Unit test ได้โดยไม่ต้อง render component
- Component เหลือแค่ JSX เกือบล้วนๆ

**❌ ข้อเสีย:**

- ต้องสร้างไฟล์ใหม่
- ถ้ามี hook เดียวใช้ที่เดียว อาจเกิน necessity (แก้ได้ด้วยการวางแผนล่วงหน้า)
- การ debug ต้อง trace เข้าไปในไฟล์ hook

---

### วิธีที่ 4: Context + Provider (Global Filter State)

**แนวคิด:** ใช้ React Context เพื่อ share filter state ข้าม component tree โดยไม่ต้อง prop drilling

```tsx
const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const filterState = useFilterState();
  return (
    <FilterContext.Provider value={filterState}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilterContext must be used within FilterProvider");
  return ctx;
}
```

**✅ ข้อดี:**

- ลด prop drilling ทั้งหมด
- Child component ใดๆ ก็ access filter ได้
- เหมาะกับ app ที่ filter มีผลหลาย component (sidebar + URL + result list)

**❌ ข้อเสีย:**

- **Over-engineering** สำหรับ sidebar ที่มี child แค่ 4-5 ตัว
- Re-render scope กว้างขึ้น (ทุก consumer re-render เมื่อ state เปลี่ยน)
- เพิ่ม complexity ในการ test (ต้อง wrap Provider)

---

## 3. ตาราง Trade-off เปรียบเทียบ

| เกณฑ์ | Grouped State | useReducer | Custom Hook | Context |
|-------|:---:|:---:|:---:|:---:|
| **ความง่าย** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Boilerplate** | น้อย | มาก | ปานกลาง | มาก |
| **Testability** | ปานกลาง | ดีมาก | ดีมาก | ปานกลาง |
| **Scalability** | ดี | ดีมาก | ดี | ดีมาก |
| **Reusability** | ต่ำ | ต่ำ | สูง | สูง |
| **เหมาะกับ scope นี้** | ✅ ดีมาก | ⚠️ เกินจำเป็น | ✅ **ดีที่สุด** | ❌ เกินจำเป็น |

> [!TIP]
> **คำแนะนำ:** สำหรับ component นี้ **วิธีที่ 3 (Custom Hook)** เป็นจุด sweet spot ที่ดีที่สุด
> เพราะได้ทั้ง separation of concerns, testability, และ reusability โดยไม่ over-engineer

---

## 4. วิธีที่ดีที่สุด + โค้ดตัวอย่างเต็ม

### Architecture Overview

```
src/
├── types/
│   └── filter.ts                  ← [NEW] shared types + constants
├── hooks/
│   └── useFilterState.ts          ← [NEW] custom hook
└── components/search/
    ├── FilterSideBar.tsx           ← [MODIFY] simplified
    └── FilterSideBar/
        ├── FilterSearchInput.tsx   ← ไม่ต้องแก้
        ├── FilterSearchTypeList.tsx← ไม่ต้องแก้
        ├── FilterRatingList.tsx    ← ไม่ต้องแก้
        ├── FilterExperience.tsx    ← ไม่ต้องแก้
        └── FilterActions.tsx       ← [MODIFY] ลด props ที่ไม่ใช้
```

---

### ไฟล์ 1: `src/types/filter.ts` — Shared Types & Constants

```ts
/**
 * Centralized filter types and default values.
 * Single Source of Truth for all filter-related type definitions.
 */

/** ค่าตัวเลือก Experience ที่เป็นไปได้ */
export const EXPERIENCE_OPTIONS = ["0-2 Years", "3-5 Years", "5+ Years"] as const;
export type ExperienceOption = (typeof EXPERIENCE_OPTIONS)[number];

/** ค่าตัวเลือก Pet Type ที่เป็นไปได้ */
export const PET_TYPE_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit"] as const;
export type PetTypeOption = (typeof PET_TYPE_OPTIONS)[number];

/** โครงสร้าง Filter State ทั้งหมด */
export interface FilterState {
  readonly searchText: string;
  readonly petTypes: PetTypeOption[];
  readonly rating: number[];
  readonly experience: ExperienceOption;
}

/** ค่า Default — ใช้ทั้ง initial state และ reset */
export const DEFAULT_FILTERS: FilterState = {
  searchText: "",
  petTypes: [],
  rating: [],
  experience: "0-2 Years",
} as const;
```

> **หลักการที่ใช้:**
>
> - **Single Source of Truth** — type และ default อยู่ที่เดียว
> - **`as const`** — TypeScript narrowing ป้องกัน typo
> - **`readonly`** — ป้องกัน mutation โดยไม่ตั้งใจ

---

### ไฟล์ 2: `src/hooks/useFilterState.ts` — Custom Hook

```ts
import { useState, useCallback, useMemo } from "react";
import type { FilterState } from "@/types/filter";
import { DEFAULT_FILTERS } from "@/types/filter";

/**
 * Custom hook สำหรับจัดการ Filter State
 *
 * @param initialState - ค่าเริ่มต้นของ filter (default: DEFAULT_FILTERS)
 * @returns filter state + updater + reset + search handler
 *
 * @example
 * const { filters, updateFilter, resetFilters } = useFilterState();
 * updateFilter("searchText", "Buddy");
 * resetFilters();
 */
export function useFilterState(initialState: FilterState = DEFAULT_FILTERS) {
  const [filters, setFilters] = useState<FilterState>(initialState);

  /** อัปเดต filter ทีละ key อย่าง type-safe */
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** รีเซ็ตกลับค่า default ทั้งหมด */
  const resetFilters = useCallback(() => {
    setFilters(initialState);
  }, [initialState]);

  /** ตรวจสอบว่ามี filter ที่ active อยู่หรือไม่ (สำหรับ UI indicator) */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchText !== initialState.searchText ||
      filters.petTypes.length !== initialState.petTypes.length ||
      filters.rating.length !== initialState.rating.length ||
      filters.experience !== initialState.experience
    );
  }, [filters, initialState]);

  return { filters, updateFilter, resetFilters, hasActiveFilters } as const;
}
```

> **หลักการที่ใช้:**
>
> - **Separation of Concerns** — logic แยกจาก UI
> - **useCallback** — ป้องกัน re-create function ทุก render
> - **useMemo (hasActiveFilters)** — derived state คำนวณเฉพาะเมื่อ filters เปลี่ยน
> - **Generic type constraint `<K extends keyof FilterState>`** — type-safe update

---

### ไฟล์ 3: `src/components/search/FilterSideBar.tsx` — Refactored Component

```tsx
import FilterSearchInput from "./FilterSideBar/FilterSearchInput";
import FilterSearchTypeList from "./FilterSideBar/FilterSearchTypeList";
import FilterRatingList from "./FilterSideBar/FilterRatingList";
import FilterActions from "./FilterSideBar/FilterActions";
import FilterExperience from "./FilterSideBar/FilterExperience";
import { useFilterState } from "@/hooks/useFilterState";
import type { FilterState } from "@/types/filter";

interface FilterSidebarProps {
  /** Callback เมื่อกด Search — ส่ง filter state ไปให้ parent */
  readonly onSearch?: (filters: FilterState) => void;
  /** Callback เมื่อ filter เปลี่ยนแปลง (สำหรับ real-time filtering) */
  readonly onFilterChange?: (filters: FilterState) => void;
}

export default function FilterSidebar({ onSearch, onFilterChange }: FilterSidebarProps) {
  const { filters, updateFilter, resetFilters } = useFilterState();

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleClear = () => {
    resetFilters();
    onFilterChange?.(filters);
  };

  return (
    <aside className="sticky top-20 w-98 h-fit px-6 py-6 bg-white shadow-lg rounded-2xl flex flex-col gap-8">
      <FilterSearchInput
        searchText={filters.searchText}
        onSearchChange={(value) => updateFilter("searchText", value)}
        label="Search"
      />
      <FilterSearchTypeList
        petTypes={filters.petTypes}
        onPetTypesChange={(value) => updateFilter("petTypes", value)}
      />
      <FilterRatingList
        rating={filters.rating}
        onRatingChange={(value) => updateFilter("rating", value)}
      />
      <FilterExperience
        experience={filters.experience}
        onExperienceChange={(value) => updateFilter("experience", value)}
      />
      <FilterActions onClear={handleClear} onSearch={handleSearch} />
    </aside>
  );
}
```

> **สิ่งที่เปลี่ยน:**
>
> - ❌ ลบ `useState` 4 ตัว → ✅ ใช้ `useFilterState()` hook
> - ❌ ลบ handler wrapper 4 ตัว → ✅ ใช้ inline `updateFilter("key", value)`
> - ❌ ลบ dead code comments
> - ❌ ลบ `console.log` → ✅ ใช้ `onSearch` callback ส่งค่าไป parent
> - ✅ เพิ่ม `FilterSidebarProps` เพื่อให้ parent เข้าถึง filter ได้
> - ✅ `FilterActions` รับแค่ `onClear` + `onSearch` (ไม่รับ filter state ที่ไม่ได้ใช้)

---

### ไฟล์ 4: `src/components/search/FilterSideBar/FilterActions.tsx` — Simplified

```tsx
import { ActionButton } from "@/components/ui/Button";

interface FilterActionsProps {
  readonly onClear: () => void;
  readonly onSearch: () => void;
}

export default function FilterActions({ onClear, onSearch }: FilterActionsProps) {
  return (
    <div className="flex flex-row gap-2">
      <ActionButton variant="secondary" className="w-41 h-12" onClick={onClear}>
        Clear
      </ActionButton>
      <ActionButton variant="primary" className="w-41 h-12" onClick={onSearch}>
        Search
      </ActionButton>
    </div>
  );
}
```

> **สิ่งที่เปลี่ยน:**
>
> - ❌ ลบ props `searchText`, `petTypes`, `rating`, `experience` ที่ไม่ได้ใช้งาน
> - ❌ ลบ wrapper functions `handleClear` / `handleSearch` ที่แค่เรียก callback ตรงๆ
> - ✅ ใช้ `readonly` บน props ตามหลัก immutability
> - ✅ เหลือแค่ 2 props ที่จำเป็นจริง (**Interface Segregation Principle**)

---

### ตัวอย่าง: การเรียกใช้งานจาก Parent (ContentSearch.tsx)

```tsx
import FilterSidebar from "./FilterSideBar";
import type { FilterState } from "@/types/filter";

export default function ContentSearch() {
  const handleSearch = (filters: FilterState) => {
    // ✅ ใช้ filters object ไป call API โดยตรง
    console.log("Calling API with:", filters);
    // fetch(`/api/pet-sitters?search=${filters.searchText}&...`)
  };

  return (
    <div className="flex gap-8">
      <FilterSidebar onSearch={handleSearch} />
      {/* ... result list ... */}
    </div>
  );
}
```

---

## 📝 สรุป Checklist สำหรับ Production

| ✅ | รายการ | สถานะ |
|----|--------|-------|
| ☐ | สร้าง `types/filter.ts` (shared types) | ยังไม่ได้ทำ |
| ☐ | สร้าง `hooks/useFilterState.ts` (custom hook) | ยังไม่ได้ทำ |
| ☐ | ปรับ `FilterSideBar.tsx` ใช้ hook + props | ยังไม่ได้ทำ |
| ☐ | ปรับ `FilterActions.tsx` ลด props ที่ไม่ใช้ | ยังไม่ได้ทำ |
| ☐ | ปรับ `ContentSearch.tsx` ส่ง `onSearch` callback | ยังไม่ได้ทำ |
| ☐ | ลบ `console.log` ทั้งหมด | ยังไม่ได้ทำ |
| ☐ | ลบ dead code comments | ยังไม่ได้ทำ |

---

> [!IMPORTANT]
> **หลักการสำคัญที่ใช้ในการ refactor:**
>
> - **SRP (Single Responsibility)** — แต่ละไฟล์ทำงานเรื่องเดียว
> - **DRY (Don't Repeat Yourself)** — type + default อยู่ที่เดียว
> - **ISP (Interface Segregation)** — component รับเฉพาะ props ที่ต้องใช้
> - **Separation of Concerns** — logic (hook) แยกจาก UI (component)
> - **Immutability** — `readonly` props + `as const` types
