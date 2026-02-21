# Key Note

# Flow Page

## 1. fetch data from API
- pet type for size bar 
- data to create pet sitter card


## 1. View Mode
- change view mode from list to map and vice versa
- use URLSearchParams to store the view mode
- use useSearchParams to get the view mode
- use router.push to update the view mode
- use router.replace to update the view mode

## 2. Filter Sidebar
- 

### Optional
- Filter sidebar should be sticky
- Ensure content layout remains horizontally centered regardless of any viewport zoom level.


### Flow
1. รอข้อมูลจาก API
2. แสดงข้อมูลในรูปแบบตาราง
3. แสดงข้อมูลในรูปแบบแผนที่
4. ทำ pagination
5. ทำ Responsive


### ที่ต้องถามไบท์
1. ปุ่มกด Rating ควรมี Animation อย่างไร logic คืออะไร
- filter Rating 5 ดาวเท่านั้น 4 ดาวเท่านั้นหรือ
- ถ้า กด 5 ดาว คือ 5 ดาวเท่านั้น
- ถ้า กด 4 ดาว คือ 4 ดาวขึ้นไป
- ถ้า กด 3 ดาว คือ 3 ดาวขึ้นไป เเต่ไม่ถึง 4 ดาว
- ถ้า กด 2 ดาว คือ 2 ดาวขึ้นไป แต่ไม่ถึง 3 ดาว
- ถ้า กด 1 ดาว คือ 1 ดาวขึ้นไป เเต่ไม่ถึง 2 ดาว

2. เมื่อกด Select CustomSelect ควรมี Animation อย่างไร
- ถ้าเลื่อนไม่สุดหน้าจอเวลากดให้โชว์ Option เเล้วตัว list จะล้นหน้าจอ
- ควรให้ระบบคิดเองว่าจะโชว์ list ลงด้านล่าง หรือขึ้นด้านบนเอง
- หรือ เมื่อกด ให้ score ลงมาให้พอดีกับ list ที่เปิดโชว์ออกมา

3. paginetion ควรใช้ logic การกดปุ่ม < >
- เมื่อกดปุ่ม < หรือ > ให้ เลื่อนหน้าไป 1 หน้าเท่านั้น
- หรือเลื่อนไปหน้าแรก หรือหน้าสุดท้าย
- หรือเลื่อนไปหน้าก่อนหน้า หรือหน้าถัดไป

4. สามารถใส่ shadow ให้กับ Card ได้ไหม เมื่อ hover เพื่อแสดงว่ากำลังจะเลือกคลิ๊กการ์ดอันไหนอยู่

5.  experience เห็นว่ามันเป็น Dropdown ตอนนี้ผมกำลังคิดว่าควรมีค่าได้แค่ 0, 0.5, 1, 1.5, …, 4, 4.5, 5, 5+ ดีไหม
หรือถ้าคำนวณจาก created_at มันก็จะมีปัญหาที่ว่า ถ้า sitter ที่พึ่งสมัคร แต่มีประสบการณ์จริงๆหลายปี ระบบมันจะคำนวณเป็น 0 ปี

6. pet type ถ้า ระบบ scale เพิ่มควรเปลี่ยน ui อย่างไร หรือเรื่องสี