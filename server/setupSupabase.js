import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupSupabase() {
  console.log('🚀 بدء إعداد Supabase...\n');

  try {
    // 1. إنشاء جدول الأدمن
    console.log('📋 إنشاء جدول admins...');
    const { error: adminsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admins (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    // 2. إنشاء جدول الطلاب
    console.log('📋 إنشاء جدول students...');
    const { error: studentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS students (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          student_id TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          points INTEGER DEFAULT 0,
          debt INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    // 3. إنشاء جدول الألعاب
    console.log('📋 إنشاء جدول games...');
    const { error: gamesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS games (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          points INTEGER NOT NULL,
          image_url TEXT,
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    // 4. إنشاء جدول المشتريات
    console.log('📋 إنشاء جدول purchases...');
    const { error: purchasesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS purchases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          student_id UUID REFERENCES students(id) ON DELETE CASCADE,
          game_id UUID REFERENCES games(id) ON DELETE CASCADE,
          points_paid INTEGER NOT NULL,
          used_debt BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    // 5. إضافة أدمن افتراضي
    console.log('👤 إضافة أدمن افتراضي...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const { error: insertError } = await supabase
      .from('admins')
      .upsert([
        { username: 'admin', password: hashedPassword }
      ], { onConflict: 'username' });

    if (insertError) {
      console.log('⚠️  الأدمن موجود مسبقاً');
    } else {
      console.log('✅ تم إضافة الأدمن');
    }

    console.log('\n✅ تم إعداد Supabase بنجاح!');
    console.log('\n📝 بيانات الدخول:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }

  process.exit(0);
}

setupSupabase();
