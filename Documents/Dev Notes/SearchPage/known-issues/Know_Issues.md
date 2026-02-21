# Known Issues — Search Page

## 1. Rating ควรโชว์เป็นดาวตั้งเเต่ 1-5 หรือ fetch จาก API ก่อนค่อยโชว์

---

## 2. ใช้ `<img>` แทน `<Image />` จาก next/image — ทำให้ LCP ช้าและใช้ bandwidth สูงกว่าจำเป็น

**ปัญหา:**

Component `PlacePicture.tsx` ใช้ HTML tag `<img>` ธรรมดาในการแสดงรูปภาพ ซึ่ง Next.js แจ้งเตือนผ่าน ESLint rule `no-img-element` เพราะ:

- ไม่มีการ optimize รูปอัตโนมัติ (ไม่ resize, ไม่แปลงเป็น WebP/AVIF)
- ทำให้ **LCP (Largest Contentful Paint)** ช้าลง ซึ่งเป็น Core Web Vitals metric สำคัญ
- ผู้ใช้ต้องโหลดรูปขนาดเต็มแม้อยู่บนมือถือหรือเน็ตช้า

**วิธีแก้ไข:**

เปลี่ยนจาก `<img>` เป็น `<Image />` จาก `next/image` พร้อมระบุ `width` และ `height` ให้ตรงกับขนาดที่แสดงผล

**ไฟล์ที่แก้ไข:**

- `src/components/search/PetSitterCard/PlacePicture.tsx`

```diff
- import { PetSitter } from "@/hooks/usePetSitterData";
+ import Image from "next/image";
+ import { PetSitter } from "@/hooks/usePetSitterData";

- <img
-   src={sitter.image}
-   alt={sitter.name}
-   className="w-[245px] h-[184px] aspect-4/3 object-cover rounded-lg"
- />
+ <Image
+   src={sitter.image}
+   alt={sitter.name}
+   width={245}
+   height={184}
+   className="w-[245px] h-[184px] aspect-4/3 object-cover rounded-lg"
+ />
```

---

## 3. `next/image` ไม่อนุญาตให้โหลดรูปจาก External Host ที่ไม่ได้ Whitelist ไว้

**ปัญหา:**

หลังจากเปลี่ยนมาใช้ `<Image />` จาก `next/image` แล้ว เกิด Runtime Error:

```text
Invalid src prop (https://images.unsplash.com/...) on `next/image`,
hostname "images.unsplash.com" is not configured under images in your `next.config.js`
```

**สาเหตุ:**

`next/image` ทำงานเป็น image proxy บน server — เพื่อป้องกันไม่ให้ถูกใช้เป็น open proxy สำหรับ URL ใดก็ได้ Next.js จึง **บังคับให้ whitelist hostname ของรูปภาพ external ทุกแหล่ง** ไว้ใน `next.config.ts` ก่อน

**วิธีแก้ไข:**

เพิ่ม `images.remotePatterns` ใน `next.config.ts` เพื่ออนุญาต hostname ที่ต้องการ

**ไฟล์ที่แก้ไข:**

- `next.config.ts`

```diff
  const nextConfig: NextConfig = {
    reactCompiler: true,
+   images: {
+     remotePatterns: [
+       {
+         protocol: "https",
+         hostname: "images.unsplash.com",
+       },
+     ],
+   },
  };
```

> **หมายเหตุ:** การแก้ไข `next.config.ts` ต้อง **restart dev server** ถึงจะมีผล
> หากในอนาคตมีการใช้รูปจาก host อื่น (เช่น Google, S3) ต้องเพิ่ม entry ใหม่เข้าไปใน `remotePatterns` ด้วย