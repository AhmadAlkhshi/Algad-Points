import { supabase } from './config/supabase.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  const studentId = '0936109942';
  const newPassword = '123456';
  
  console.log(`جاري تحديث كلمة المرور للطالب ${studentId}...`);
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { data, error } = await supabase
    .from('students')
    .update({ 
      password: hashedPassword,
      plain_password: newPassword 
    })
    .eq('student_id', studentId)
    .select();

  if (error) {
    console.error('خطأ:', error);
  } else if (data.length === 0) {
    console.log('❌ الطالب غير موجود');
  } else {
    console.log(`✅ تم تحديث كلمة المرور للطالب: ${data[0].name}`);
    console.log(`📱 رقم الطالب: ${studentId}`);
    console.log(`🔐 كلمة المرور الجديدة: ${newPassword}`);
  }

  process.exit(0);
}

resetPassword();
