# Code Review & Refactor: `FilterSearchInput.tsx`

> **วันที่บันทึก:** 2026-02-21  
> **ไฟล์ที่เกี่ยวข้อง:** `src/components/search/FilterSideBar/FilterSearchInput.tsx`  
> **หัวข้อ:** Refactor ตามหลัก Software Engineering สู่ Production-level Code

---

## 🔍 ปัญหาที่พบใน Code เดิม

### 1. Props Type — ใช้ชื่อ `set<StateName>` แทน `on<EventName>`

```tsx
// ❌ Before — บอก consumer ว่า "ไปเซ็ต state ของฉัน" → coupling สูง
interface FilterSearchInputProps {
  searchText: string;
  setSearchText: (searchText: string) => void;
}

// ✅ After — บอก consumer ว่า "มี event เกิดขึ้น" → ยืดหยุ่นกว่า
interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}
```

**หลักการ:** Loose Coupling — component ไม่ควร "รู้" ว่า parent เอา value ไปทำอะไร แค่ "แจ้ง" ว่ามี event เกิดขึ้น

---

### 2. Hardcoded `placeholder` — ผิด Open/Closed Principle

```tsx
// ❌ Before
placeholder="Place Holder"

// ✅ After — รับเป็น optional prop พร้อม default value
placeholder={placeholder ?? "Search pet sitter..."}
```

**หลักการ:** Open/Closed Principle (OCP) — component ควรเปิดรับการ extend โดยไม่ต้องแก้ไม่ใน source code

---

### 3. Hardcoded Label Text — ลด Reusability

```tsx
// ❌ Before
<label>Search</label>

// ✅ After
<label>{label}</label>
```

---

### 4. Hardcoded `id` — เสี่ยง Duplicate IDs

```tsx
// ❌ Before — ถ้า render 2 ครั้ง จะมี id ซ้ำ → ผิดมาตรฐาน HTML
id="search-pet-sitter"

// ✅ After — ใช้ useId() จาก React 18
const id = useId();
<Input id={id} />
<label htmlFor={id}>
```

**หลักการ:** Accessibility (a11y) + ความถูกต้องของ HTML spec

---

### 5. Trailing Whitespace ใน className

```tsx
// ❌ Before
className="flex flex-col gap-2  "   // space ซ้ำ
className="style-body-2 "           // space ซ้ำ

// ✅ After
className="flex flex-col gap-2"
className="style-body-2"
```

---

### 6. ปัญหาใน `FilterSideBar.tsx` — Typo + State ไม่ถูก Pass

```tsx
// ❌ Before — Typo และ state ไม่ถูกส่งลง child
const [searchText, setSerchText] = useState<string>(""); // Typo: "Serch"
<FilterSearchInput />  // ไม่ส่ง props เลย!

// ✅ After
const [searchText, setSearchText] = useState<string>("");
const handleSearchChange = (value: string) => {
  setSearchText(value);
};
<FilterSearchInput
  searchText={searchText}
  onSearchChange={handleSearchChange}
  label="Search"
/>
```

---

## ✅ โค้ดหลัง Refactor

```tsx
// FilterSearchInput.tsx
import { useId } from "react";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function FilterSearchInput({
  searchText,
  onSearchChange,
  placeholder = "Search pet sitter...",
  label = "Search",
}: FilterSearchInputProps) {
  const id = useId();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="style-body-2">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="h-12 w-full selection:bg-orange-200"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
```

---

## 📚 สรุปหลักการที่นำมาใช้

| หลักการ | นำมาใช้อย่างไร |
|---|---|
| **Single Responsibility Principle (SRP)** | Component ทำแค่ render input + แจ้ง event ขึ้นไป ไม่จัดการ state เอง |
| **Open/Closed Principle (OCP)** | รับ `placeholder` และ `label` เป็น props แทน hardcode |
| **Loose Coupling** | ใช้ `onSearchChange` แทน `setSearchText` — parent ตัดสินใจเองว่าจะทำอะไรกับ value |
| **Accessibility (a11y)** | ใช้ `useId()` ให้ `htmlFor` กับ `id` ตรงกันเสมอแม้ render หลายครั้ง |
| **Naming Convention** | `on<Event>` สำหรับ callback props เป็นมาตรฐานของ React ecosystem |
| **Code Cleanliness** | ลบ trailing whitespace และแก้ Typo ออก |

---

> 💡 **Mindset ของ Senior Dev:**
> ทุกครั้งที่เขียน component ให้ถามตัวเองว่า
> *"ถ้าต้องเอา component นี้ไปใช้ที่อื่น จะต้องแก้อะไรบ้าง?"*
> ยิ่งไม่ต้องแก้เลย = ออกแบบดีมากครับ

---

---

## 🔍 Code Review รอบที่ 2 — ระดับ Senior Dev (Advanced)

> **วันที่บันทึก:** 2026-02-21 (หลังฝึก Refactor ครั้งแรก)

โค้ดรอบนี้ดีขึ้นมากแล้ว ✅ ด้านล่างคือจุดที่ละเอียดขึ้นในระดับ production จริงๆ

### ✅ สิ่งที่ทำได้ดีมากในรอบนี้

| สิ่งที่ทำ | เหตุผลที่ดี |
|---|---|
| ตั้งชื่อ `inputId` แทน `id` | ชัดเจนกว่า — บอกว่าเป็น id ของ input โดยเฉพาะ |
| `import { useId }` ไว้บนสุด | React imports ควรอยู่บนสุด ตามมาด้วย third-party แล้วค่อย internal |
| Self-closing `<Input />` | ถูกต้องตาม JSX convention สำหรับ elements ที่ไม่มี children |
| Default values ใน destructuring | Cleaner กว่าการเช็ค `?? "..."` ใน JSX |

---

### ❌ สิ่งที่ยังสามารถปรับปรุงได้

---

#### 1. `function` declaration ภายใน Component — ควรหลีกเลี่ยง

```tsx
// ❌ ปัจจุบัน — function declaration ไม่ใช่ pattern หลักใน React
function handleSearchChange(e:React.ChangeEvent<HTMLInputElement>) {
  onSearchChange(e.target.value);
}

// ✅ ควรเป็น — arrow function สอดคล้องกับ React community standard
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  onSearchChange(e.target.value);
};
```

**เหตุผล:** React codebase ทั่วไปใช้ `const` + arrow function สำหรับ handler ภายใน component เสมอ
ทำให้โค้ดอ่านได้ชัดว่า "นี่คือ local variable ใน scope ของ function นี้" ไม่ใช่ top-level function

---

#### 2. Missing Space หลัง Colon ใน Type Annotation — Linting Standard

```tsx
// ❌ ผิด formatting — Prettier จะแก้ให้อัตโนมัติ
(e:React.ChangeEvent<HTMLInputElement>)

// ✅ ถูกต้อง — ต้องมี space หลัง colon เสมอ
(e: React.ChangeEvent<HTMLInputElement>)
```

**เหตุผล:** TypeScript style guide และ Prettier enforces space after `:` ใน type annotations
ถ้าโปรเจกต์ตั้ง Prettier + ESLint CI จะ fail ทันที

---

#### 3. File Comment บรรทัดแรก — Redundant

```tsx
// ❌ ไม่จำเป็น — filename บอกอยู่แล้ว
// FilterSearchInput.tsx
import { useId } from "react";

// ✅ ลบออก — เริ่มด้วย import ได้เลย
import { useId } from "react";
```

**เหตุผล:** File comment แบบนี้เป็น anti-pattern ในโปรเจกต์ professional
เพราะถ้า file ถูก rename แต่ลืมแก้ comment จะทำให้ misleading
IDE และ explorer แสดงชื่อไฟล์อยู่แล้ว

---

#### 4. Search Icon ขาด `aria-hidden` — Accessibility (a11y)

```tsx
// ❌ Screen reader จะพยายามอ่าน SVG icon นี้โดยไม่มี meaningful label
<Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

// ✅ Icon ที่เป็น decorative ต้อง hidden จาก assistive technology
<Search
  aria-hidden="true"
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
/>
```

**หลักการ:** WCAG 2.1 guideline — decorative elements ที่ไม่มีความหมายต้อง `aria-hidden="true"`
ป้องกัน screen reader อ่านว่า "SVG" หรือ "image" โดยไม่มีบริบท

---

#### 5. `handleSearchChange` เป็น Thin Wrapper — พิจารณา Inline หรือ `useCallback`

```tsx
// ⚠️ ปัจจุบัน — แค่ unwrap e.target.value เป็น function แยก
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  onSearchChange(e.target.value);
};
onChange={handleSearchChange}

// ✅ Option A: Inline — simple & readable, เหมาะกับ component ทั่วไป
onChange={(e) => onSearchChange(e.target.value)}

// ✅ Option B: useCallback — production pattern เมื่อ Input เป็น memo'd component
//   หรือ onSearchChange มีโอกาสทำให้ parent re-render บ่อย
import { useCallback } from "react";

const handleSearchChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  },
  [onSearchChange] // dependency array
);
```

**เหตุผล:** `useCallback` ป้องกันการ create function ใหม่ทุก render cycle
ใช้เมื่อ handler ถูกส่งลง child component ที่ wrap ด้วย `React.memo`

---

#### 6. ขาด `className` Prop — Extensibility

```tsx
// ❌ ปัจจุบัน — parent ไม่สามารถ override หรือเพิ่ม style จากภายนอกได้
interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

// ✅ Production pattern (ตาม shadcn/ui convention) — รับ className เพิ่ม
interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string; // ← เพิ่มบรรทัดนี้
}

// แล้วใช้ cn() utility ใน className ของ wrapper
import { cn } from "@/lib/utils";

<div className={cn("flex flex-col gap-2", className)}>
```

**หลักการ:** API Design — component ที่ดีควร expose `className` prop เพื่อให้ consumer customize ได้โดยไม่ต้องแก้ source

---

### ✅ โค้ด Production-Level ฉบับสมบูรณ์ (Round 2)

```tsx
import { useCallback, useId } from "react";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSearchInputProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function FilterSearchInput({
  searchText,
  onSearchChange,
  placeholder = "Search pet sitter...",
  label = "Search",
  className,
}: FilterSearchInputProps) {
  const inputId = useId();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="style-body-2">
        {label}
      </label>
      <div className="relative">
        <Input
          id={inputId}
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="h-12 w-full selection:bg-orange-200"
        />
        <Search
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
```

---

### 📚 สรุปหลักการเพิ่มเติมจาก Round 2

| หลักการ | นำมาใช้อย่างไร |
|---|---|
| **Code Style Consistency** | ใช้ arrow function สำหรับ handler ทุกตัวใน React component |
| **Formatting Standards** | space หลัง `:` ใน type annotation — Prettier/ESLint enforce |
| **YAGNI (No Redundant Code)** | ลบ file comment ที่ไม่จำเป็นออก |
| **Accessibility (WCAG 2.1)** | `aria-hidden="true"` สำหรับ decorative icon |
| **Performance** | `useCallback` ป้องกัน unnecessary re-render ของ child |
| **Extensibility / API Design** | รับ `className` prop พร้อมใช้ `cn()` สำหรับ class merging |

---

> 💡 **Mindset ของ Senior Dev (Round 2):**
> โค้ดที่ดีไม่ใช่แค่ "ทำงานได้" แต่ต้องผ่าน 3 คำถาม:
> 1. *"คนอื่นอ่านแล้วเข้าใจภายใน 30 วินาทีไหม?"* → Readability
> 2. *"ถ้ามี screen reader หรือ keyboard-only user จะใช้งานได้ไหม?"* → Accessibility
> 3. *"ถ้า component นี้ถูก render 100 ครั้งพร้อมกัน จะยังเร็วอยู่ไหม?"* → Performance
