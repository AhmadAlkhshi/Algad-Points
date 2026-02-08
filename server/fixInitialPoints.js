import { supabase } from './config/supabase.js';

async function fixInitialPoints() {
  console.log('جاري فحص وإصلاح initial_points...\n');
  
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('student_id');

  if (error) {
    console.error('خطأ:', error);
    return;
  }

  console.log(`وجدنا ${students.length} طالب\n`);

  for (const student of students) {
    console.log(`📌 ${student.name} (${student.student_id})`);
    console.log(`   النقاط الحالية: ${student.points}`);
    console.log(`   النقاط الأولية: ${student.initial_points || 'غير محددة'}`);
    
    if (!student.initial_points || student.initial_points === 0) {
      const { error: updateError } = await supabase
        .from('students')
        .update({ initial_points: student.points })
        .eq('id', student.id);

      if (updateError) {
        console.log(`   ❌ فشل التحديث`);
      } else {
        console.log(`   ✅ تم تحديث initial_points إلى ${student.points}`);
      }
    }
    
    const maxDebt = Math.floor((student.initial_points || student.points) * 0.1);
    console.log(`   الحد الأقصى للدين: ${maxDebt}\n`);
  }

  console.log('✅ تم الانتهاء!');
  process.exit(0);
}

fixInitialPoints();
