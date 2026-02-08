import { supabase } from './config/supabase.js';
import bcrypt from 'bcryptjs';

// تحديث كلمات المرور للطلاب الموجودين
async function updatePlainPasswords() {
  console.log('جاري تحديث كلمات المرور...');
  
  // جلب كل الطلاب اللي ما عندهم plain_password
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .is('plain_password', null);

  if (error) {
    console.error('خطأ في جلب الطلاب:', error);
    return;
  }

  console.log(`وجدنا ${students.length} طالب بحاجة لتحديث`);

  // لكل طالب، نولد كلمة مرور جديدة
  for (const student of students) {
    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('students')
      .update({ 
        password: hashedPassword,
        plain_password: newPassword 
      })
      .eq('id', student.id);

    if (updateError) {
      console.error(`فشل تحديث ${student.name}:`, updateError);
    } else {
      console.log(`✅ تم تحديث ${student.name} - كلمة المرور الجديدة: ${newPassword}`);
    }
  }

  console.log('✅ تم الانتهاء!');
  process.exit(0);
}

updatePlainPasswords();
