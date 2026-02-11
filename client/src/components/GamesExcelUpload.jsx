import { useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../api';

export default function GamesExcelUpload({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const downloadTemplate = () => {
    const template = [
      { 'اسم اللعبة': 'مثال: FIFA 24', 'الوصف': 'لعبة كرة قدم', 'النقاط': 50, 'رابط الصورة': 'https://...' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Games');
    XLSX.writeFile(wb, 'نموذج_الألعاب.xlsx');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      let errorCount = 0;

      for (const row of jsonData) {
        try {
          await api.post('/api/games', {
            name: row['اسم اللعبة'] || row.name,
            description: row['الوصف'] || row.description || '',
            points: parseInt(row['النقاط'] || row.points),
            image_url: row['رابط الصورة'] || row.image_url || ''
          });
          successCount++;
        } catch (err) {
          console.error('Error adding game:', err);
          errorCount++;
        }
      }

      alert(`تم إضافة ${successCount} لعبة بنجاح${errorCount > 0 ? `\nفشل ${errorCount} لعبة` : ''}`);
      onSuccess();
    } catch (err) {
      alert('حدث خطأ في قراءة الملف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          background: dragActive ? '#e3f2fd' : '#f5f7fa',
          border: `2px dashed ${dragActive ? '#1976d2' : '#cbd5e0'}`,
          borderRadius: '15px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onClick={() => document.getElementById('games-excel-input').click()}
      >
        <div style={{
          width: '80px',
          height: '80px',
          background: '#e3f2fd',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem'
        }}>
          ☁️
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.3rem' }}>
          اسحب وأفلت ملفاتك هنا
        </h3>
        <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.95rem' }}>
          الحد الأقصى لحجم الملف: 10 MB
        </p>
        <button
          type="button"
          disabled={loading}
          style={{
            padding: '0.8rem 2rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'جاري الرفع...' : 'اختر الملفات'}
        </button>
        <input
          id="games-excel-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
          الأعمدة المطلوبة: <strong>اسم اللعبة, الوصف, النقاط, رابط الصورة</strong>
        </p>
        <button
          onClick={downloadTemplate}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          💾 تحميل نموذج Excel
        </button>
      </div>
    </div>
  );
}
