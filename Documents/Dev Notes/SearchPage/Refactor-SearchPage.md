# Refactor Search Page — คำอธิบายและเหตุผล

## ภาพรวม

Refactor `page.tsx` ตามหลัก Software Engineering 5 ข้อ:

1. **DRY** — ไม่ render component ซ้ำ 2 ชุด
2. **SRP** — แยก layout logic ออกจาก route file
3. **ลบ TestResponsive** — ไม่ควรอยู่ใน production
4. **No Magic Values** — รวม hardcoded values เป็น constants
5. **CSS > JS Responsive** — ใช้ Tailwind `lg:` แทน `useScreenContext`

---

## 1. DRY — ลบ Duplicate Component Rendering

### ❌ ก่อนแก้ — Component ถูก render 2 ชุด

```tsx
// page.tsx (ก่อนแก้)
{/* Desktop Layout */}
<div className={cn("hidden", isWebView && "flex ...")}>
  <HeaderSearchViewMode />     // ← ชุดที่ 1
  <FilterSidebar />
  <MainViewSearch />
</div>

{/* Mobile Layout */}
<div className={cn("flex ...", isWebView && "hidden")}>
  <FilterSidebar />            // ← ชุดที่ 2 (ซ้ำ!)
  <HeaderSearchViewMode />
  <MainViewSearch />
</div>
```

**ปัญหา:**

- Component mount 2 ครั้ง → กิน memory 2 เท่า
- ถ้า component มี side effect (เช่น API call) จะเรียก 2 ครั้ง
- แก้ไข layout ต้องแก้ 2 ที่

### ✅ หลังแก้ — CSS Order จัดลำดับ
```
/**
 * SearchPageContent
 *
 * Inner component ที่อยู่ภายใน PetSitterSearchProvider → ใช้ context ได้
 *
 * Layout Strategy:
 * ใช้ CSS Tailwind responsive (`lg:` = ≥1024px) จัดลำดับ layout
 * แทนการใช้ JS (`useScreenContext`) ที่ page level
 *
 * ┌─ Mobile (<1024px) ─────────┐    ┌─ Desktop (≥1024px) ────────────┐
 * │  Filter    (order-1)       │    │  Header       (order-1)        │
 * │  Header    (order-2)       │    │  ┌─────────┬──────────────┐    │
 * │  Main      (order-3)       │    │  │ Filter  │   Main       │    │
 * │  Pagination                │    │  └─────────┴──────────────┘    │
 * └────────────────────────────┘    │  Pagination                    │
 *                                   └────────────────────────────────┘
 */
 ```
 
```tsx
// SearchPageContent.tsx (หลังแก้)
<div className="... flex flex-col gap-6 px-4 lg:px-0">
  {/* Header — Mobile: order-2 / Desktop: order-1 */}
  <div className="order-2 lg:order-1">
    <HeaderSearchViewMode />
  </div>

  {/* Filter + Main — Mobile: column / Desktop: row */}
  <div className="order-1 lg:order-2 flex flex-col lg:flex-row ...">
    <FilterSidebar />
    <div className="order-3 lg:order-2 w-full">
      <MainViewSearch />
    </div>
  </div>
</div>
```

**วิธีการ:** ใช้ CSS `order` property เปลี่ยนลำดับการแสดงผล:

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Header | order-2 (อันดับ 2) | order-1 (อันดับ 1) |
| Filter + Main wrapper | order-1 (อันดับ 1) | order-2 (อันดับ 2) |

**`order` คืออะไร?** → CSS property ที่บอก flexbox ว่าให้แสดง element ตัวนี้ในลำดับที่เท่าไร โดยไม่ต้องเปลี่ยนโครงสร้าง HTML

```
Mobile: order-1(Filter+Main) → order-2(Header) → แสดงเป็น Filter → Header → Main
Desktop: lg:order-1(Header) → lg:order-2(Filter+Main) → แสดงเป็น Header → [Filter | Main]
```

---

## 2. SRP (Single Responsibility Principle) — แยกไฟล์

### หลักการ
>
> "แต่ละ module ควรมีเหตุผลเดียวในการเปลี่ยนแปลง"

### ❌ ก่อนแก้ — page.tsx ทำ 2 อย่าง

```tsx
// page.tsx ทำทั้ง route definition + layout logic
export default function SearchPage() {
  const { isSmall, isMedium, isLarge } = useScreenContext(); // layout logic
  // ... JSX 50+ บรรทัด
}
```

### ✅ หลังแก้ — แยกหน้าที่ชัดเจน

```
src/app/search/page.tsx              → Route Shell (Provider + Suspense)
src/components/search/SearchPageContent.tsx → Layout Logic
```

**`page.tsx` (Route Shell) — 30 บรรทัด:**

```tsx
export default function SearchPage() {
  return (
    <div className={`${PAGE_STYLES.minHeight} ${PAGE_STYLES.bgColor} ...`}>
      <Suspense fallback={<Loading />}>
        <PetSitterSearchProvider>
          <SearchPageContent />
        </PetSitterSearchProvider>
      </Suspense>
    </div>
  );
}
```

**ข้อดี:**

- Route file สะอาด — เปิดแล้วเข้าใจทันทีว่าหน้านี้ใช้ Provider + Content อะไร
- `SearchPageContent` สามารถ test และ reuse แยกได้
- เมื่อแก้ layout ไม่ต้องไปยุ่งกับ route config

---

## 3. ลบ TestResponsive

### ❌ ก่อนแก้

```tsx
<TestResponsive />  // debug overlay แสดงขนาดหน้าจอ
```

### ✅ หลังแก้

ลบออกจาก production code — component สำหรับ debug ไม่ควรอยู่ใน codebase ถาวร

**ทางเลือก:** ถ้ายังต้องการใช้ สามารถ wrap ด้วย env check:

```tsx
{process.env.NODE_ENV === "development" && <TestResponsive />}
```

---

## 4. No Magic Values — ใช้ Constants

### ❌ ก่อนแก้ — Hardcoded values กระจายใน JSX

```tsx
className="min-h-[375px] bg-[#FAFAFB]"     // page.tsx
className="max-w-[1440px]"                   // SearchPageContent
className="px-[92px]"                        // SearchPageContent
```

### ✅ หลังแก้ — รวมเป็น Object Constants

```tsx
// page.tsx
const PAGE_STYLES = {
  minHeight: "min-h-[375px]",
  bgColor: "bg-[#FAFAFB]",
} as const;

// SearchPageContent.tsx
const LAYOUT = {
  pageMaxWidth: "max-w-[1440px]",
  desktopSidePadding: "lg:px-[92px]",
  contentGap: "gap-6",
  sidebarGap: "lg:gap-9",
} as const;
```

**ข้อดี:**

- เปลี่ยน design token ที่เดียว → มีผลทุกที่
- อ่านโค้ดแล้วเข้าใจว่าค่ามาจากไหน
- `as const` ทำให้ TypeScript narrow type เป็น literal

---

## 5. CSS > JS Responsive

### ❌ ก่อนแก้ — JS-based responsive

```tsx
const { isSmall, isMedium, isLarge } = useScreenContext();
const isWebView = isSmall && isMedium && isLarge;

// ใช้ cn() เช็คแบบ JS
className={cn("hidden", isWebView && "flex flex-col gap-6 w-full")}
```

**ปัญหา:**

1. **Layout Shift** — Server render ทุก flag เป็น `false` → hydrate แล้วเปลี่ยน → user เห็น flash
2. **Performance** — ต้อง run JS + re-render ทุกครั้งที่ resize
3. **SEO** — Crawler อาจเห็น layout ผิดเพราะ server render ไม่มี window

### ✅ หลังแก้ — CSS Tailwind breakpoints

```tsx
// ใช้ Tailwind lg: โดยตรง → browser จัดการเอง ไม่ต้อง JS
<div className="order-2 lg:order-1">
<div className="flex flex-col lg:flex-row">
```

**Breakpoint Mapping:**

| useScreen flag | Tailwind prefix | Min-width |
|---------------|-----------------|-----------|
| `isSmall` | `sm:` | 640px (40rem) |
| `isMedium` | `md:` | 768px (48rem) |
| `isLarge` | `lg:` | 1024px (64rem) |

`isWebView = isSmall && isMedium && isLarge` → เทียบเท่า `lg:` (≥1024px)

**ข้อดี:**

- ไม่มี layout shift (CSS ทำงานก่อน paint)
- Performance ดีกว่า (ไม่ต้อง JS re-render)
- SEO-friendly (server render ถูกต้องตาม media query)

---

## สรุป Before vs After

### ก่อน (page.tsx — 71 บรรทัด)

```
page.tsx
├── imports (16 lines)
├── SearchPageContent() — layout + responsive logic (40 lines)
│   ├── useScreenContext → JS responsive
│   ├── <TestResponsive /> → debug component
│   ├── Desktop Layout → render 3 components
│   ├── Mobile Layout → render 3 components อีกครั้ง (ซ้ำ!)
│   └── <Pagination currentPage={1} totalPages={10} /> → hardcoded
└── SearchPage() — route shell (10 lines)
```

### หลัง (2 ไฟล์)

```
page.tsx (34 บรรทัด) — Clean Route Shell
├── PAGE_STYLES constant
└── SearchPage() → Provider + Suspense + <SearchPageContent />

SearchPageContent.tsx (69 บรรทัด)
├── LAYOUT constants (centralized magic values)
└── SearchPageContent()
    ├── CSS order → responsive layout (ไม่ใช้ JS)
    ├── HeaderSearchViewMode (1 instance)
    ├── FilterSidebar (1 instance)
    ├── MainViewSearch (1 instance)
    └── <Pagination /> (connected to context)
```

| เกณฑ์ | ก่อน | หลัง |
|-------|------|------|
| Component instances | 6 (ซ้ำ 2 ชุด) | 3 (ชุดเดียว) |
| JS responsive check | ✅ ใช้ | ❌ ไม่ใช้ (CSS) |
| Layout shift risk | สูง | ไม่มี |
| Debug component in prod | ✅ มี | ❌ ลบแล้ว |
| Magic values | กระจาย | รวมเป็น constants |
| File responsibilities | 2 อย่างใน 1 ไฟล์ | แยกชัดเจน |
