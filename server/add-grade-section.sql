-- نفذ هذا في Supabase SQL Editor

ALTER TABLE students ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS section TEXT;
