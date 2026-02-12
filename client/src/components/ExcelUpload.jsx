import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import api from '../api';

export default function ExcelUpload({ onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const { data } = await api.get('/api/grades');
      setGrades(data);
    } catch (err) {
      console.error('Error fetching grades:', err);
    }
  };

  const generatePassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // تحديث الصفوف أولاً والحصول على القيمة الجديدة
    const { data: latestGrades } = await api.get('/api/grades');
    setGrades(latestGrades);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellText: false, cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });

      const students = json.map(row => {
        const gradeName = row['الصف'] || row['grade'] || '';
        const gradeObj = latestGrades.find(g => g.name === gradeName);
        
        if (!gradeObj && gradeName) {
          console.warn(`الصف "${gradeName}" غير موجود في النظام`);
        }
        
        return {
          name: row['اسم الطالب'] || row['name'] || '',
          grade_id: gradeObj?.id,
          gradeName: gradeName,
          section: row['الشعبة'] || row['section'] || '',
          phone: row['رقم واتساب'] || row['phone'] || '',
          password: generatePassword(),
          points: parseInt(row['النقاط'] || row['points'] || 0)
        };
      });

      setPreview(students);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (preview.length === 0) {
      alert('لا يوجد طلاب للرفع');
      return;
    }

    setUploading(true);
    let success = 0;
    let failed = 0;

    for (const student of preview) {
      try {
        await api.post('/api/students', student);
        success++;
      } catch (err) {
        console.error('Failed to add:', student.name, err);
        failed++;
      }
    }

    setUploading(false);
    alert(`تم إضافة ${success} طالب بنجاح${failed > 0 ? `\nفشل ${failed} طالب` : ''}`);
    setPreview([]);
    onSuccess();
  };

  const downloadTemplate = () => {
    const template = [
      { 'اسم الطالب': 'محمد أحمد', 'الصف': 'الصف السابع', 'الشعبة': 'A', 'رقم واتساب': '96170123456', 'النقاط': 100 },
      { 'اسم الطالب': 'فاطمة علي', 'الصف': 'الصف الثامن', 'الشعبة': 'B', 'رقم واتساب': '96170654321', 'النقاط': 150 }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلاب');
    XLSX.writeFile(wb, 'نموذج_الطلاب.xlsx');
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
      <h3>📤 رفع طلاب من Excel</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={downloadTemplate}
          style={{ padding: '0.8rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          📥 تحميل نموذج Excel
        </button>
        
        <label style={{ padding: '0.8rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          📂 اختر ملف Excel
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {preview.length > 0 && (
        <div>
          <h4>معاينة ({preview.length} طالب)</h4>
          <div style={{ maxHeight: '300px', overflow: 'auto', background: 'white', padding: '1rem', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>الاسم</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>الصف</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>الشعبة</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>رقم واتساب</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>كلمة المرور</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>النقاط</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((student, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem' }}>{student.name}</td>
                    <td style={{ padding: '0.5rem' }}>{student.gradeName} {student.grade_id ? `(ID: ${student.grade_id})` : '❌'}</td>
                    <td style={{ padding: '0.5rem' }}>{student.section}</td>
                    <td style={{ padding: '0.5rem', color: '#25D366', fontWeight: '600' }}>{student.phone || '-'}</td>
                    <td style={{ padding: '0.5rem', color: '#667eea', fontWeight: '600' }}>{student.password}</td>
                    <td style={{ padding: '0.5rem' }}>{student.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={uploading}
            style={{ 
              marginTop: '1rem', 
              padding: '1rem 2rem', 
              background: uploading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: uploading ? 'not-allowed' : 'pointer', 
              fontWeight: '700',
              fontSize: '1rem'
            }}
          >
            {uploading ? 'جاري الرفع...' : '✅ تأكيد رفع الطلاب'}
          </button>
        </div>
      )}
    </div>
  );
}
