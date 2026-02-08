import { supabase } from './config/supabase.js';

async function updateStudentInitialPoints() {
  const studentId = '0936109942';
  const newInitialPoints = 199;
  
  console.log(`جاري تحديث النقاط الأولية للطالب ${studentId}...`);
  
  const { data, error } = await supabase
    .from('students')
    .update({ initial_points: newInitialPoints })
    .eq('student_id', studentId)
    .select();

  if (error) {
    console.error('خطأ:', error);
  } else if (data.length === 0) {
    console.log('❌ الطالب غير موجود');
  } else {
    const maxDebt = Math.floor(newInitialPoints * 0.1);
    console.log(`✅ تم التحديث للطالب: ${data[0].name}`);
    console.log(`📊 النقاط الأولية: ${newInitialPoints}`);
    console.log(`💳 الحد الأقصى للدين: ${maxDebt}`);
  }

  process.exit(0);
}

updateStudentInitialPoints();
