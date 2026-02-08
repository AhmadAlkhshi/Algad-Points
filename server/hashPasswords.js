import bcrypt from 'bcryptjs';
import { supabase } from './config/supabase.js';

async function hashExistingPasswords() {
  console.log('تشفير كلمات المرور...');

  // تشفير باسورد الأدمن
  const hashedAdminPass = await bcrypt.hash('admin123', 10);
  await supabase
    .from('admins')
    .update({ password: hashedAdminPass })
    .eq('username', 'admin');

  console.log('✅ تم تشفير كلمة مرور الأدمن');

  // تشفير باسوردات الطلاب (إذا كان فيه)
  const { data: students } = await supabase.from('students').select('*');
  
  if (students && students.length > 0) {
    for (const student of students) {
      // افترض أن الباسورد الحالي نفس رقم الطالب
      const hashedPass = await bcrypt.hash(student.student_id, 10);
      await supabase
        .from('students')
        .update({ password: hashedPass })
        .eq('id', student.id);
    }
    console.log(`✅ تم تشفير كلمات مرور ${students.length} طالب`);
  }

  console.log('✅ انتهى التشفير');
  process.exit(0);
}

hashExistingPasswords();
