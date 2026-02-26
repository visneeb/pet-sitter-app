# 📄 อธิบายไฟล์ `Input.tsx`

> **ที่อยู่ไฟล์:** `src/components/ui/input/Input.tsx`
> **หน้าที่:** เป็น **Reusable Input Component** สำหรับใช้ทั่วทั้งโปรเจกต์ ออกแบบมาให้ยืดหยุ่น, รองรับ `ref`, รองรับ error state, และสามารถใส่ element ทางขวาของ input ได้ (เช่น icon ค้นหา, ปุ่มลบข้อความ)

---

## 🔍 อธิบายทีละบรรทัด

### บรรทัดที่ 1: `"use client";`

```tsx
"use client";
```

- เป็น **Next.js directive** บอกว่าไฟล์นี้เป็น **Client Component**
- จำเป็นต้องใส่เพราะ component นี้ใช้ `React.forwardRef` ซึ่งเป็น React API ฝั่ง client
- ถ้าไม่ใส่ Next.js จะถือว่าเป็น Server Component ซึ่งจะ error เมื่อใช้ React features ฝั่ง client

---

### บรรทัดที่ 3: `import * as React from "react";`

```tsx
import * as React from "react";
```

- import **React ทั้งหมด** เข้ามาเป็น namespace `React`
- ใช้สำหรับเรียก `React.forwardRef`, `React.ComponentPropsWithoutRef`, `React.ReactNode`
- ใช้ `import *` แทน `import React` เพราะเป็น pattern ที่ทำงานได้ดีกับทั้ง CommonJS และ ES Modules

---

### บรรทัดที่ 4: `import cn from "@/utils/cn";`

```tsx
import cn from "@/utils/cn";
```

- import ฟังก์ชัน `cn` ที่เป็น **utility สำหรับรวม CSS class names**
- ภายในใช้ `clsx` + `tailwind-merge`:
  - `clsx` → รวม class names หลายตัว, รองรับ conditional
  - `twMerge` → จัดการ Tailwind class ซ้ำซ้อน (เช่น `px-3` กับ `px-5` จะเหลือแค่ `px-5`)

```ts
// ตัว cn ข้างในทำงานแบบนี้:
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

---

### บรรทัดที่ 5: `import { baseInputStyles } from "./inputStyle";`

```tsx
import { baseInputStyles } from "./inputStyle";
```

- import **style พื้นฐาน** ที่ใช้ร่วมกันระหว่าง input components ต่าง ๆ (Input, Password, Select เป็นต้น)
- ค่าจริงคือ string ของ Tailwind classes:

```ts
// inputStyle.tsx
export const baseInputStyles =
  "w-full style-input text-black bg-white rounded-lg border border-gray-200 px-3 h-12 transition-all outline-none focus-visible:border focus-visible:border-orange-500 disabled:bg-gray-100 disabled:text-gray-300";
```

| Class | ความหมาย |
|-------|----------|
| `w-full` | ความกว้างเต็ม parent |
| `text-black bg-white` | ตัวอักษรดำ, พื้นหลังขาว |
| `rounded-lg` | มุมโค้ง |
| `border border-gray-200` | ขอบสีเทาอ่อน |
| `px-3 h-12` | padding ซ้ายขวา 12px, สูง 48px |
| `transition-all` | animation เวลาเปลี่ยน state |
| `outline-none` | ลบ default outline ของ browser |
| `focus-visible:border-orange-500` | เมื่อ focus → ขอบสีส้ม |
| `disabled:bg-gray-100` | เมื่อ disabled → พื้นหลังเทา |

---

### บรรทัดที่ 7–10: Type Definition

```tsx
export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  error?: boolean;
  rightAction?: React.ReactNode;
};
```

**แยกส่วนอธิบาย:**

| ส่วน | ความหมาย |
|------|----------|
| `React.ComponentPropsWithoutRef<"input">` | **รับ props ทุกอย่าง** ที่ `<input>` HTML ปกติรับได้ เช่น `type`, `placeholder`, `value`, `onChange`, `disabled` ฯลฯ — **ยกเว้น** `ref` (เพราะจัดการผ่าน `forwardRef` แทน) |
| `error?: boolean` | prop เพิ่มเติม — ถ้าเป็น `true` จะเปลี่ยนขอบเป็นสีแดง |
| `rightAction?: React.ReactNode` | prop เพิ่มเติม — ใส่ element อะไรก็ได้ทางขวาของ input (icon, ปุ่ม ฯลฯ) |

> 💡 **ทำไมใช้ `ComponentPropsWithoutRef` ?**
> เพราะ component นี้ใช้ `React.forwardRef` จัดการ `ref` เอง ถ้าใช้ `ComponentPropsWithRef` จะเกิด type ซ้ำซ้อนกัน

---

### บรรทัดที่ 12–13: Component Declaration

```tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, rightAction, ...props }, ref) => {
```

**แยกส่วนอธิบาย:**

- `React.forwardRef<HTMLInputElement, InputProps>(...)`:
  - **Generic ตัวที่ 1** `HTMLInputElement` = ประเภทของ ref (จะได้ `.focus()`, `.value` ฯลฯ)
  - **Generic ตัวที่ 2** `InputProps` = ประเภทของ props ทั้งหมด
  - `forwardRef` ทำให้ component **ส่ง `ref` ผ่านไปยัง `<input>` ข้างใน** → parent สามารถควบคุม input ได้โดยตรง

- Parameter destructuring `({ className, error, rightAction, ...props }, ref)`:
  - `className` → ดึงออกมาเพื่อรวมกับ base styles ผ่าน `cn`
  - `error` → ดึงออกมาเพื่อ toggle style ขอบแดง
  - `rightAction` → ดึงออกมาเพื่อ render element ทางขวา
  - `...props` → props ที่เหลือทั้งหมด (spread เข้า `<input>`)
  - `ref` → ref object จาก parent

> 💡 **ทำไมต้อง `forwardRef` ?**
> เพราะปกติ function component ใน React **ไม่รับ `ref` ตรง ๆ** ถ้าอยากให้ parent เข้าถึง DOM element ข้างในได้ (เช่น `.focus()`) ต้องใช้ `forwardRef` ครอบ

---

### บรรทัดที่ 14–25: JSX ส่วน Input

```tsx
return (
  <div className="relative w-full">
    <input
      ref={ref}
      className={cn(
        baseInputStyles,
        error && "border-red",
        rightAction && "pr-10",
        className,
      )}
      {...props}
    />
```

| บรรทัด | อธิบาย |
|--------|--------|
| `<div className="relative w-full">` | **Wrapper div** — ใช้ `relative` เพื่อให้ `rightAction` (ที่ใช้ `absolute`) จัดตำแหน่งสัมพัทธ์กับ div นี้ |
| `ref={ref}` | ส่ง `ref` ไปให้ `<input>` จริง ๆ → parent เข้าถึง DOM element ได้ |
| `cn(baseInputStyles, ...)` | **รวม class names** ตามลำดับ: |
| → `baseInputStyles` | style พื้นฐานเสมอ |
| → `error && "border-red"` | ถ้า `error` เป็น `true` → เพิ่ม class ขอบแดง |
| → `rightAction && "pr-10"` | ถ้ามี `rightAction` → เพิ่ม padding ขวา 40px เพื่อไม่ให้ข้อความทับ icon |
| → `className` | class เพิ่มเติมจาก parent (override ได้เพราะ `twMerge`) |
| `{...props}` | กระจาย props ที่เหลือทั้งหมดเข้า `<input>` เช่น `type`, `placeholder`, `value`, `onChange` |

---

### บรรทัดที่ 27–31: Conditional Rendering ของ rightAction

```tsx
{rightAction && (
  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
    {rightAction}
  </div>
)}
```

| ส่วน | อธิบาย |
|------|--------|
| `rightAction && (...)` | **Conditional rendering** — render เฉพาะเมื่อมี `rightAction` |
| `absolute` | ทำให้ div นี้ลอยอยู่ใน wrapper (ทับบน input) |
| `inset-y-0` | ยืดเต็มแนวตั้ง (บนล่าง = 0) |
| `right-0` | ชิดขวา |
| `flex items-center` | จัดให้ content อยู่ตรงกลางแนวตั้ง |
| `pr-3` | padding ขวา 12px |

---

### บรรทัดที่ 37: Display Name

```tsx
Input.displayName = "Input";
```

- ตั้งชื่อ display name ให้ component
- ช่วยให้ **React DevTools** แสดงชื่อ `Input` แทนที่จะแสดง `ForwardRef` (ซึ่งอ่านยาก)
- เป็น **best practice** เมื่อใช้ `forwardRef`

---

## 🏗️ ภาพรวมโครงสร้างการทำงาน

```
┌─────────────────────────────────────────────┐
│  <div className="relative w-full">          │
│                                             │
│  ┌───────────────────────────────────┬────┐ │
│  │  <input>                          │ 🔍 │ │
│  │  (ใส่ข้อความตรงนี้)                │    │ │
│  └───────────────────────────────────┴────┘ │
│                                    ↑        │
│                              rightAction    │
│                              (absolute)     │
└─────────────────────────────────────────────┘
```

---

## 🔧 ตัวอย่างการนำไปใช้จริงในโปรเจกต์

### ตัวอย่างที่ 1: ใช้ใน `FilterSearchInput.tsx` (หน้า Search)

```tsx
// src/components/search/FilterSideBar/FilterSearchInput.tsx
<Input
  id={inputId}
  type="text"
  value={searchText}
  onChange={handleSearchChange}
  placeholder={placeholder}
  className="h-12 w-full selection:bg-orange-200"
  rightElement={
    searchText.length === 0 ? (
      <Search className="text-gray-300" />     // แสดง icon แว่นขยาย
    ) : (
      <button onClick={handleCancelChange}>
        <X />                                   // แสดงปุ่ม X ลบข้อความ
      </button>
    )
  }
/>
```

**จุดสำคัญ:**

- ใช้ `rightElement` แสดง icon ที่เปลี่ยนตามสถานะ (ว่าง → 🔍, มีข้อความ → ✕)
- ส่ง `className` เพิ่มเติมเพื่อ customize selection color

---

### ตัวอย่างที่ 2: ใช้ใน `Password.tsx` (ช่อง Password)

```tsx
// src/components/ui/input/Password.tsx
<Input
  ref={ref}
  type={show ? "text" : "password"}
  error={hasError}
  className={cn("pr-24", className)}
  {...props}
/>
```

**จุดสำคัญ:**

- **ส่ง `ref` ผ่าน** → Password เป็น forwardRef เช่นกัน ส่ง ref ต่อไปให้ Input
- **ใช้ `error` prop** → Input จะเปลี่ยนขอบเป็นสีแดง
- **ส่ง `type` แบบ dynamic** → สลับระหว่าง text / password ตาม state `show`
- **Spread `...props`** → props อื่น ๆ (placeholder, onChange ฯลฯ) ส่งผ่านต่อไป

---

### ตัวอย่างที่ 3: ใช้ใน `RHFInput.tsx` (React Hook Form)

```tsx
// src/components/form/RHFInput.tsx
<Input
  ref={ref}
  error={!!fieldState.error}
  {...props}
/>
```

**จุดสำคัญ:**

- ครอบ Input ด้วย React Hook Form `Controller` เพื่อเชื่อม form validation
- ใช้ `ref` จาก `field.ref` ของ React Hook Form
- ใช้ `error` prop เชื่อมกับ `fieldState.error`

---

## 📚 Concepts ที่ใช้ในไฟล์นี้

| Concept | คำอธิบาย |
|---------|----------|
| **Reusable Component** | ออกแบบให้ใช้ซ้ำได้ทั่วโปรเจกต์ ไม่ผูกกับ logic ใด ๆ |
| **forwardRef** | ส่ง ref ผ่าน component ไปยัง DOM element จริง |
| **Composition** | ใช้ `rightAction` prop รับ ReactNode ที่ยืดหยุ่น (icon, ปุ่ม, อะไรก็ได้) |
| **Spread Props (`...props`)** | รับ props มาตรฐานของ HTML input ทั้งหมดโดยไม่ต้องประกาศทีละตัว |
| **Conditional Styling** | ใช้ `error &&` และ `rightAction &&` เปลี่ยน class ตามเงื่อนไข |
| **Utility-first CSS** | ใช้ Tailwind CSS class ทั้งหมด ไม่มี custom CSS file |
| **Class Merging** | ใช้ `cn` (clsx + twMerge) จัดการ class ซ้ำซ้อนอัตโนมัติ |
| **Display Name** | ตั้งชื่อสำหรับ DevTools เพื่อ debugging ง่ายขึ้น |

---

## 🗂️ ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | ความสัมพันธ์ |
|------|-------------|
| `src/components/ui/input/inputStyle.tsx` | เก็บ base styles ที่ใช้ร่วมกัน |
| `src/utils/cn.ts` | utility สำหรับรวม class names |
| `src/components/ui/input/Password.tsx` | ใช้ Input เป็น base สร้าง Password field |
| `src/components/form/RHFInput.tsx` | ครอบ Input ด้วย React Hook Form |
| `src/components/search/FilterSideBar/FilterSearchInput.tsx` | ใช้ Input ในหน้า Search |
