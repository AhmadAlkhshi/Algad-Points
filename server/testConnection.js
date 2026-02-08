import { supabase } from './config/supabase.js';

async function testConnection() {
  console.log('🔍 اختبار الاتصال بـ Supabase...\n');

  try {
    // اختبار الاتصال
    const { data, error } = await supabase
      .from('admins')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ فشل الاتصال:', error.message);
      console.log('\n💡 تأكد من:');
      console.log('   1. SUPABASE_URL صحيح في ملف .env');
      console.log('   2. SUPABASE_SERVICE_KEY صحيح في ملف .env');
      console.log('   3. تم تنفيذ السكيما في Supabase SQL Editor');
      process.exit(1);
    }

    console.log('✅ الاتصال ناجح!');
    console.log('✅ جدول admins موجود');
    
    // اختبار باقي الجداول
    const tables = ['students', 'games', 'purchases'];
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.log(`❌ جدول ${table} غير موجود`);
      } else {
        console.log(`✅ جدول ${table} موجود`);
      }
    }

    console.log('\n🎉 كل شيء جاهز! يمكنك تشغيل السيرفر الآن.');
    
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

testConnection();
