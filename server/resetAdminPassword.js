import { supabase } from './config/supabase.js';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  const username = 'admin';
  const newPassword = '123456';
  
  console.log(`جاري تحديث كلمة مرور الأدمن...`);
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { data, error } = await supabase
    .from('admins')
    .update({ password: hashedPassword })
    .eq('username', username)
    .select();

  if (error) {
    console.error('خطأ:', error);
  } else if (data.length === 0) {
    console.log('❌ الأدمن غير موجود');
  } else {
    console.log(`✅ تم تحديث كلمة مرور الأدمن`);
    console.log(`👤 اسم المستخدم: ${username}`);
    console.log(`🔐 كلمة المرور الجديدة: ${newPassword}`);
  }

  process.exit(0);
}

resetAdminPassword();
