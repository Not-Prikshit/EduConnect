from src.excel_ops import ensure_files_exist, add_faculty_slot, get_free_slots

ensure_files_exist()

add_faculty_slot("Teacher1", "CSE", "2025-11-25", "10:00", "11:00", "teacher1@example.com")
add_faculty_slot("Teacher2", "ECE", "2025-11-25", "11:00", "12:00", "teacher2@example.com")

print("Seed complete")
for s in get_free_slots():
    print(s)
