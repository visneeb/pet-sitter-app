# Refactor Notes: `HeaderSearchViewMode.tsx`

> **Date:** 2026-02-21  
> **File:** `src/components/search/HeaderSearchViewMode.tsx`  
> **Author:** AI Code Review  
> **Concept:** Software Engineering Best Practices สำหรับ React + TypeScript

---

## 📋 สรุปปัญหาที่พบ (Code Smell Summary)

| # | ปัญหา | หลักการที่เกี่ยวข้อง | ความเร่งด่วน |
|---|-------|----------------------|--------------|
| 1 | Style string ซ้ำซ้อน และไม่มี Type Safety | DRY, Type Safety | 🔴 สูง |
| 2 | Magic String `"list"`, `"map"` กระจายในโค้ด | Magic Values → Named Constants | 🔴 สูง |
| 3 | View Button มี Logic/JSX ซ้ำ (Duplicate Code) | DRY, Component Abstraction | 🟡 กลาง |
| 4 | Component ไม่มี `Suspense` boundary | Next.js Best Practice (`useSearchParams`) | 🔴 สูง |
| 5 | Fallback ของ `URLSearchParams` ใช้ `"list"` ซึ่งผิด context | Logic Bug / Defensive Coding | 🟡 กลาง |
| 6 | ขาด Separation of Concerns (Logic อยู่รวมกับ View) | SoC, Single Responsibility Principle | 🟡 กลาง |
| 7 | ไม่มี Accessibility (a11y) | Accessibility / WCAG | 🟡 กลาง |

---

## 🔍 การวิเคราะห์แต่ละปัญหา

### 1. 🔴 Magic String — ควรใช้ Named Constants หรือ `type`

**โค้ดเดิม:**

```tsx
const currentView = searchParams?.get("view") || "list";
const changeView = (mode: string) => { ... }
params.set("view", mode);
```

**ปัญหา:**  

- `"list"`, `"map"`, `"view"` เป็น magic string ที่กระจายอยู่ในโค้ด
- ถ้า key เปลี่ยน ต้องหาและแก้ทุกจุด → เสี่ยง Bug
- `mode: string` ไม่มี type constraint → รับค่าอะไรก็ได้

**วิธีแก้ไข:**

```tsx
// constants/viewMode.ts (แยกไฟล์หรือไว้ด้านบนไฟล์)
const VIEW_PARAM_KEY = "view" as const;

type ViewMode = "list" | "map";
const DEFAULT_VIEW: ViewMode = "list";

// ใน component
const currentView = (searchParams?.get(VIEW_PARAM_KEY) ?? DEFAULT_VIEW) as ViewMode;
const changeView = (mode: ViewMode) => { ... };
```

---

### 2. 🔴 ไม่มี `Suspense` Boundary — Next.js จะ Throw Warning/Error

**โค้ดเดิม:**

```tsx
// ใช้ useSearchParams() ตรงๆ โดยไม่มี Suspense
const searchParams = useSearchParams();
```

**ปัญหา:**  
Next.js App Router กำหนดว่า component ที่ใช้ `useSearchParams()` ต้องถูกครอบด้วย `<Suspense>` ที่ฝั่ง parent **หรือ** component นั้นต้องเป็น Client Component ที่ Export แบบ dynamic

**วิธีแก้ไข (ที่ parent หรือ `page.tsx`):**

```tsx
import { Suspense } from "react";
import HeaderSearchViewMode from "@/components/search/HeaderSearchViewMode";

// ใน JSX ของ parent
<Suspense fallback={<div>Loading header...</div>}>
  <HeaderSearchViewMode />
</Suspense>
```

---

### 3. 🔴 Fallback String ใน `URLSearchParams` ผิด Context

**โค้ดเดิม:**

```tsx
const params = new URLSearchParams(searchParams?.toString() ?? "list");
```

**ปัญหา:**  
Fallback `"list"` ไม่ใช่ query string ที่ถูกต้อง  
ถ้า `searchParams` เป็น null → `new URLSearchParams("list")` จะ parse `"list"` เป็น key ไม่มี value ทำให้ URL พัง

**วิธีแก้ไข:**

```tsx
const params = new URLSearchParams(searchParams?.toString() ?? "");
```

---

### 4. 🟡 Duplicate JSX — ควร Extract เป็น Sub-Component

**โค้ดเดิม:**

```tsx
<button onClick={() => changeView("list")} className={...}>
  <div className="flex flex-row gap-2 justify-center items-center">
    <List />
    <p className="style-body-2">List</p>
  </div>
</button>

<button onClick={() => changeView("map")} className={...}>
  <div className="flex flex-row gap-2 justify-center items-center">
    <Map />
    <p className="style-body-2">Map</p>
  </div>
</button>
```

**ปัญหา:**  
โค้ดซ้ำกัน 2 ปุ่ม → ถ้าเพิ่ม view mode ใหม่ต้อง copy-paste → DRY Violation

**วิธีแก้ไข (Extract Component):**

```tsx
interface ViewButtonProps {
  mode: ViewMode;
  currentView: ViewMode;
  icon: React.ReactNode;
  label: string;
  onClick: (mode: ViewMode) => void;
}

function ViewButton({ mode, currentView, icon, label, onClick }: ViewButtonProps) {
  const isActive = currentView === mode;
  return (
    <button
      onClick={() => onClick(mode)}
      className={isActive ? activeStyle : inactiveStyle}
      aria-pressed={isActive}          // ✅ Accessibility
      aria-label={`Switch to ${label} view`}
    >
      <div className="flex flex-row gap-2 justify-center items-center">
        {icon}
        <span className="style-body-2">{label}</span>
      </div>
    </button>
  );
}
```

---

### 5. 🟡 ขาด Accessibility (a11y)

**ปัญหา:**  

- ปุ่มไม่มี `aria-label` หรือ `aria-pressed` → Screen reader ไม่รู้ว่าปุ่มไหน active
- ใช้ `<p>` แทน `<span>` ภายใน `<button>` → semantic ไม่ถูกต้อง (block element ใน inline element)

**วิธีแก้ไข:**

```tsx
<button aria-label="Switch to List view" aria-pressed={currentView === "list"}>
  <span className="style-body-2">List</span>
</button>
```

---

### 6. 🟡 Style String ควรจัดการด้วย Utility Function

**โค้ดเดิม:**

```tsx
const activeStyle = "w-20 h-10 hover:ring-4 ... text-orange-500 border-orange-500 ...";
const inactiveStyle = "w-20 h-10 hover:ring-4 ... text-gray-300 border-gray-300 ...";
```

**ปัญหา:**  
Base class ซ้ำกัน → ถ้าแก้ base style ต้องแก้ 2 ที่

**วิธีแก้ไข:**

```tsx
const baseStyle = "w-20 h-10 rounded-lg transition shadow-md hover:ring-4";
const activeStyle = `${baseStyle} hover:ring-orange-200 text-orange-500 border border-orange-500`;
const inactiveStyle = `${baseStyle} hover:ring-gray-200 text-gray-300 border border-gray-300`;

// หรือใช้ utility function
const getButtonStyle = (isActive: boolean) =>
  `${baseStyle} ${isActive
    ? "hover:ring-orange-200 text-orange-500 border border-orange-500"
    : "hover:ring-gray-200 text-gray-300 border border-gray-300"
  }`;
```

---

## ✅ โค้ดหลัง Refactor (Full Example)

```tsx
"use client";

import { List, Map } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// --- Constants ---
const VIEW_PARAM_KEY = "view" as const;
const DEFAULT_VIEW = "list" as const;
type ViewMode = "list" | "map";

// --- Styles ---
const BASE_STYLE = "w-20 h-10 rounded-lg transition shadow-md hover:ring-4";
const getButtonStyle = (isActive: boolean) =>
  `${BASE_STYLE} ${
    isActive
      ? "hover:ring-orange-200 text-orange-500 border border-orange-500"
      : "hover:ring-gray-200 text-gray-300 border border-gray-300"
  }`;

// --- Sub-Component ---
interface ViewButtonProps {
  mode: ViewMode;
  currentView: ViewMode;
  icon: React.ReactNode;
  label: string;
  onClick: (mode: ViewMode) => void;
}

function ViewButton({ mode, currentView, icon, label, onClick }: ViewButtonProps) {
  return (
    <button
      onClick={() => onClick(mode)}
      className={getButtonStyle(currentView === mode)}
      aria-pressed={currentView === mode}
      aria-label={`Switch to ${label} view`}
    >
      <div className="flex flex-row gap-2 justify-center items-center">
        {icon}
        <span className="style-body-2">{label}</span>
      </div>
    </button>
  );
}

// --- Main Component ---
export default function HeaderSearchViewMode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = (searchParams?.get(VIEW_PARAM_KEY) ?? DEFAULT_VIEW) as ViewMode;

  const changeView = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(VIEW_PARAM_KEY, mode);
    router.push(`?${params.toString()}`);
  };

  return (
    <header className="flex flex-row justify-between items-center w-full h-22 px-[92px]">
      <h3 className="style-headline-3">Search For Pet Sitter</h3>
      <div className="flex flex-row gap-3">
        <ViewButton
          mode="list"
          currentView={currentView}
          icon={<List aria-hidden="true" />}
          label="List"
          onClick={changeView}
        />
        <ViewButton
          mode="map"
          currentView={currentView}
          icon={<Map aria-hidden="true" />}
          label="Map"
          onClick={changeView}
        />
      </div>
    </header>
  );
}
```

---

## 📚 หลักการ Software Engineering ที่ใช้

| หลักการ | ความหมาย | จุดที่นำไปใช้ |
|---------|----------|---------------|
| **DRY** (Don't Repeat Yourself) | ห้ามโค้ดซ้ำ | Extract `ViewButton`, `baseStyle` |
| **SRP** (Single Responsibility) | แต่ละชิ้นทำงานเดียว | แยก `ViewButton` sub-component ออกมา |
| **Type Safety** | กำหนด type ให้ชัดเจน | ใช้ `ViewMode` type แทน `string` |
| **Named Constants** | หลีกเลี่ยง Magic Value | ใช้ `VIEW_PARAM_KEY`, `DEFAULT_VIEW` |
| **Defensive Coding** | รับมือกับ edge case | แก้ fallback `"list"` → `""` |
| **Accessibility (a11y)** | รองรับ Assistive Technology | เพิ่ม `aria-pressed`, `aria-label` |
| **Next.js Best Practice** | ปฏิบัติตาม framework guideline | ครอบ `<Suspense>` ที่ parent |

---

## 🔄 Round 2: ตรวจสอบหลัง Refactor (2026-02-21)

> ผู้ใช้ได้ implement การ refactor ตามแนวทางแล้ว ตรวจสอบซ้ำพบปัญหาเพิ่มเติมดังนี้

### สรุปปัญหาใหม่ที่พบ

| # | ไฟล์ | ปัญหา | ความเร่งด่วน |
|---|------|-------|--------------|
| 1 | `ViewButton.tsx` | Duplicate Constants — re-define `ViewMode`, `VIEW_PARAM_KEY`, `DEFAULT_VIEW` แทนที่จะ import จาก `@/constants/viewMode` | 🔴 สูง |
| 2 | `ViewButton.tsx` | Style Logic ควรแยกออกมาเป็นไฟล์หรือ import จากกลาง | 🟢 ต่ำ |
| 3 | `ViewButton.tsx` | ขาด `"use client"` directive (ถ้า icon เป็น interactive element) | 🟡 กลาง |

---

### 🔴 ปัญหาที่ 1: Duplicate Constants ใน `ViewButton.tsx`

**โค้ดปัจจุบัน (ผิด):**

```tsx
// ViewButton.tsx — lines 1-4 (ซ้ำกับ constants/viewMode.ts !)
const VIEW_PARAM_KEY = "view" as const;   // ❌ ซ้ำ
const DEFAULT_VIEW = "list" as const;     // ❌ ซ้ำ
type ViewMode = "list" | "map";           // ❌ ซ้ำ
```

**ปัญหา:**

- `ViewButton.tsx` define constants/type เองแทนที่จะ import จาก `@/constants/viewMode.ts`
- ถ้าแก้ไข `ViewMode` ใน `constants/viewMode.ts` → `ViewButton.tsx` จะไม่ถูกอัปเดต → **Type mismatch bug**
- นี่คือ **DRY Violation** ที่เกิดขึ้นหลังจาก refactor เอง

**วิธีแก้ไข — `ViewButton.tsx` ที่ถูกต้อง:**

```tsx
// ✅ Import จาก centralized constants
import { ViewMode } from "@/constants/viewMode";
// ไม่ต้อง import VIEW_PARAM_KEY / DEFAULT_VIEW เพราะ ViewButton ไม่ได้ใช้

// ลบบรรทัด 1-4 ของ ViewButton.tsx ออกทั้งหมด
```

> **หลักการ:** Source of Truth ต้องมีที่เดียว — `constants/viewMode.ts` เป็นเจ้าของ type/constant เหล่านี้

---

### 🟡 ปัญหาที่ 2: ควรเพิ่ม `"use client"` ใน `ViewButton.tsx`

**เหตุผล:**

- `ViewButton.tsx` รับ `onClick` handler → เป็น interactive component (Client-side)
- Next.js App Router อาจ throw error ถ้าพยายาม render โดยไม่มี directive นี้ในบางกรณี

**วิธีแก้:**

```tsx
"use client";  // เพิ่มบรรทัดแรก

import { ViewMode } from "@/constants/viewMode";
// ...rest of file
```

---

### `ViewButton.tsx` ที่ถูกต้องหลังแก้ไข

```tsx
"use client";

import { ViewMode } from "@/constants/viewMode";

// --- Styles ---
const BASE_STYLE = "w-20 h-10 rounded-lg transition shadow-md hover:ring-4";
const getButtonStyle = (isActive: boolean) =>
  `${BASE_STYLE} ${
    isActive
      ? "hover:ring-orange-200 text-orange-500 border border-orange-500"
      : "hover:ring-gray-200 text-gray-300 border border-gray-300"
  }`;

// --- Component ---
interface ViewButtonProps {
  mode: ViewMode;
  currentView: ViewMode;
  icon: React.ReactNode;
  label: string;
  onClick: (mode: ViewMode) => void;
}

export default function ViewButton({ mode, currentView, icon, label, onClick }: ViewButtonProps) {
  return (
    <button
      onClick={() => onClick(mode)}
      className={getButtonStyle(currentView === mode)}
      aria-pressed={currentView === mode}
      aria-label={`Switch to ${label} view`}
    >
      <div className="flex flex-row gap-2 justify-center items-center">
        {icon}
        <span className="style-body-2">{label}</span>
      </div>
    </button>
  );
}
```

---

## 🧠 ควรแยก Logic ออกจาก UI ด้วย Custom Hook ไหม?

### คำตอบ: **ขึ้นอยู่กับ scope และ complexity**

---

### แนวคิด: Separation of Concerns (SoC)

| Layer | หน้าที่ | ไฟล์ |
|-------|--------|------|
| **Logic Layer** | จัดการ URL params, router | `useViewMode.ts` (Custom Hook) |
| **UI Layer** | แสดงผลปุ่ม, รับ event | `HeaderSearchViewMode.tsx`, `ViewButton.tsx` |
| **Constants** | ค่าคงที่, types | `constants/viewMode.ts` |

---

### กรณีที่ **ควร** แยกเป็น Custom Hook

✅ **ควรแยก** ถ้า:

- Logic เดียวกัน (อ่าน/เขียน `?view=` param) ถูกใช้ในหลาย component
- Logic มีความซับซ้อนเพิ่มขึ้น เช่น validation, side effects, analytics tracking
- ต้องการ test logic แยกจาก UI (unit testing)

**ตัวอย่าง Custom Hook:**

```ts
// hooks/useViewMode.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ViewMode, VIEW_PARAM_KEY, DEFAULT_VIEW } from "@/constants/viewMode";

export function useViewMode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = (searchParams?.get(VIEW_PARAM_KEY) ?? DEFAULT_VIEW) as ViewMode;

  const changeView = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(VIEW_PARAM_KEY, mode);
    router.push(`?${params.toString()}`);
  };

  return { currentView, changeView };
}
```

**Component ที่ใช้ hook:**

```tsx
// HeaderSearchViewMode.tsx (สะอาด มากขึ้น!)
"use client";

import { List, Map } from "lucide-react";
import { useViewMode } from "@/hooks/useViewMode";
import ViewButton from "./ViewMode/ViewButton";

export default function HeaderSearchViewMode() {
  const { currentView, changeView } = useViewMode(); // ✅ Logic แยกออกจาก UI แล้ว

  return (
    <header className="flex flex-row justify-between items-center w-full h-22 px-[92px]">
      <h3 className="style-headline-3">Search For Pet Sitter</h3>
      <div className="flex flex-row gap-3">
        <ViewButton mode="list" currentView={currentView} icon={<List aria-hidden="true" />} label="List" onClick={changeView} />
        <ViewButton mode="map"  currentView={currentView} icon={<Map  aria-hidden="true" />} label="Map"  onClick={changeView} />
      </div>
    </header>
  );
}
```

---

### กรณีที่ **ไม่จำเป็น** ต้องแยก

❌ **ไม่ต้องแยก** ถ้า:

- Logic ใช้แค่ที่เดียว (ใน `HeaderSearchViewMode.tsx` เท่านั้น)
- Logic สั้น เข้าใจง่าย (แค่ 5-6 บรรทัด)
- Project ขนาดเล็ก ไม่ได้วางแผน scale ใหญ่

> **สรุป:** สำหรับ project Pet Sitter นี้ ถ้า `changeView` / `currentView` ถูกใช้แค่ใน `HeaderSearchViewMode` เดียว **ไม่จำเป็น** ต้องแยกตอนนี้ แต่ถ้าอนาคตต้องการใช้ใน component อื่น ควรแยกเป็น `useViewMode.ts`

---

## 🗺️ โครงสร้างไฟล์ที่แนะนำ (Final)

```
src/
├── constants/
│   └── viewMode.ts           ← ViewMode type, VIEW_PARAM_KEY, DEFAULT_VIEW
├── hooks/
│   └── useViewMode.ts        ← (Optional) ถ้า logic ใช้หลายที่
├── components/
│   ├── common/
│   │   └── loading/
│   │       └── loading.tsx   ← Suspense fallback
│   └── search/
│       ├── HeaderSearchViewMode.tsx  ← Main component (UI + logic หรือแค่ UI)
│       └── ViewMode/
│           └── ViewButton.tsx        ← Sub-component (import ViewMode จาก constants)
```
