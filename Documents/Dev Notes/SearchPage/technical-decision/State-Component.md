# State Management for Filter Components

> **วันที่บันทึก:** 2026-02-21  
> **หัวข้อ:** วิธีเก็บค่า Filter จากหลาย Component เพื่อยิง API เมื่อกดปุ่ม Search

---

## ปัญหา

ค่า filter แต่ละตัวอยู่คนละ component แต่ต้องรวมกันเมื่อกดปุ่ม **Search** ใน `FilterActions`

### Component Tree (ปัจจุบัน)

```
SearchPage (page.tsx)
  └── ContentSearch
        └── FilterSidebar
              ├── FilterSearchInput     ← มี searchText
              ├── FilterSearchTypeList  ← มี petTypes[]
              ├── FilterRatingList      ← มี rating
              ├── FilterExperience      ← มี experience (มี local state แล้ว)
              └── FilterActions         ← มีปุ่ม Search / Clear
```

ทุก filter component เป็น **siblings** (พี่น้องกัน) ภายใต้ `FilterSidebar`  
จึงไม่สามารถส่ง state ตรงๆ ระหว่างกันได้ ต้องผ่าน parent

---

## ตัวเลือก

---

### Option 1: Lift State Up (State Lifting)

**Concept:** ย้าย state ทั้งหมดไปอยู่ที่ `FilterSidebar` (parent) แล้วส่งลงมาผ่าน props

```
FilterSidebar  ← เก็บ state ทุกอย่างที่นี่
  ├── FilterSearchInput     → รับ value + onChange (prop)
  ├── FilterSearchTypeList  → รับ value + onChange (prop)
  ├── FilterRatingList      → รับ value + onChange (prop)
  ├── FilterExperience      → รับ value + onChange (prop)
  └── FilterActions         → รับ onSearch + onClear (prop)
```

**ตัวอย่างโค้ด — FilterSidebar.tsx:**

```tsx
export default function FilterSidebar() {
  const [searchText, setSearchText] = useState("");
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [experience, setExperience] = useState("0-3 Years");

  const handleSearch = async () => {
    const result = await fetch(
      `/api/sitters?search=${searchText}&petTypes=${petTypes}&rating=${rating}&experience=${experience}`
    );
    // ...
  };

  return (
    <aside>
      <FilterSearchInput value={searchText} onChange={setSearchText} />
      <FilterSearchTypeList value={petTypes} onChange={setPetTypes} />
      <FilterRatingList value={rating} onChange={setRating} />
      <FilterExperience value={experience} onChange={setExperience} />
      <FilterActions onSearch={handleSearch} onClear={() => { /* reset all */ }} />
    </aside>
  );
}
```

**ตัวอย่างโค้ด — FilterSearchInput.tsx (child รับ props):**

```tsx
type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function FilterSearchInput({ value, onChange }: Props) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

| | |
|---|---|
| ✅ **ข้อดี** | ง่าย, ไม่มี dependency เพิ่ม, เข้าใจและ debug ง่าย |
| ✅ **ข้อดี** | เหมาะกับ component ที่ไม่ได้ใช้ state ร่วมกับส่วนอื่นๆ ของ app |
| ❌ **ข้อเสีย** | ถ้า component tree ลึกมากจะเกิด **Props Drilling** (ส่ง props ผ่านหลาย layer) |

---

### Option 2: React Context API

**Concept:** สร้าง "ห้องกลาง" (Context) ให้ทุก component เข้าถึง state ได้โดยตรง โดยไม่ต้องส่ง props

```tsx
// FilterContext.tsx
const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    searchText: "",
    petTypes: [],
    rating: null,
    experience: "0-3 Years",
  });

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <FilterContext.Provider value={{ filters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

// ใช้ใน component ลูกได้เลย โดยไม่ต้องรับ props
function FilterSearchInput() {
  const { filters, updateFilter } = useContext(FilterContext);
  return (
    <Input
      value={filters.searchText}
      onChange={(e) => updateFilter("searchText", e.target.value)}
    />
  );
}
```

| | |
|---|---|
| ✅ **ข้อดี** | แก้ปัญหา Props Drilling ได้ |
| ✅ **ข้อดี** | ทุก component เข้าถึง state ได้ตรงๆ ไม่ต้องรับ props |
| ❌ **ข้อเสีย** | ทุกครั้งที่ filter ตัวใดเปลี่ยน จะ re-render **ทุก** component ที่ใช้ context นั้น |
| ❌ **ข้อเสีย** | ต้อง setup เพิ่ม (FilterProvider, useFilter custom hook) |

---

### Option 3: Global State Manager (Zustand / Redux Toolkit)

**Concept:** มี "store" กลางนอก React tree — ทุก component ดึงข้อมูลจาก store ตรงๆ

```tsx
// filterStore.ts (Zustand)
import { create } from "zustand";

const useFilterStore = create((set) => ({
  searchText: "",
  petTypes: [],
  rating: null,
  experience: "0-3 Years",
  setSearchText: (v) => set({ searchText: v }),
  setRating: (v) => set({ rating: v }),
  handleSearch: async () => {
    const s = useFilterStore.getState();
    await fetch(`/api/sitters?search=${s.searchText}&rating=${s.rating}...`);
  },
}));

// ใช้ใน component ได้เลย
function FilterSearchInput() {
  const { searchText, setSearchText } = useFilterStore();
  return (
    <Input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
}
```

| | |
|---|---|
| ✅ **ข้อดี** | ไม่มี Props Drilling เลย |
| ✅ **ข้อดี** | Re-render เฉพาะ component ที่ subscribe state นั้นๆ (performance ดีกว่า Context) |
| ✅ **ข้อดี** | Filter state ใช้ร่วมกับ component อื่นๆ ใน app ได้ง่าย (เช่น HeaderSearchBar) |
| ❌ **ข้อเสีย** | ต้องลง library เพิ่ม (`zustand`) |
| ❌ **ข้อเสีย** | Overkill ถ้า project เล็กและ filter ไม่ได้ใช้ข้าม component tree |

---

## เปรียบเทียบสรุป

| เกณฑ์ | Option 1: Lift State Up | Option 2: Context | Option 3: Zustand |
|---|:---:|:---:|:---:|
| Project ขนาดเล็ก-กลาง | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Filter ใช้แค่ใน Sidebar | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Filter ใช้หลายที่ในหน้า (Header ด้วย) | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| ต้องการ Persist filter ข้าม page | ⭐ | ⭐ | ⭐⭐⭐ |

---

## ✅ การตัดสินใจ: Option 1 — Lift State Up

**เหตุผล:**
- Filter component ทั้งหมดอยู่ภายใต้ `FilterSidebar` เดียว ไม่ได้ deep nested
- ไม่มี Props Drilling เพราะมีแค่ 1 layer (`FilterSidebar` → child filter components)
- ขยายไปใช้ Zustand ได้ทีหลังง่ายมากถ้า app ใหญ่ขึ้น

---

## 💡 Bonus: URL Search Params

ถ้าต้องการรองรับ **URL Sharing** (copy URL แล้วค่า filter ยังอยู่)  
เช่น `?petTypes=Dog&rating=4` — ควรใช้ `useSearchParams` จาก Next.js

```tsx
import { useRouter, useSearchParams } from "next/navigation";

const router = useRouter();
const searchParams = useSearchParams();

const handleSearch = () => {
  const params = new URLSearchParams();
  params.set("search", searchText);
  params.set("rating", String(rating));
  router.push(`/search?${params.toString()}`);
};
```

> เหมาะมากสำหรับหน้า Search โดยเฉพาะ เพราะ user share link ได้และกด Back แล้วยังเห็นผล filter เดิม
