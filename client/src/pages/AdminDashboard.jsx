import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ImageUpload from "../components/ImageUpload";
import ExcelUpload from "../components/ExcelUpload";
import GamesExcelUpload from "../components/GamesExcelUpload";
import "../styles/AdminDashboard.css";

// ========== رسالة الواتساب - غيرها من هون ==========
const WHATSAPP_MESSAGE = (
  studentName,
  studentId,
  password,
  points,
  websiteUrl,
) =>
  `
السلام عليكم ورحمة الله وبركاته

 الله يعطيكم العافية  

بيانات حساب الطالب *${studentName}* في نظام النقاط في ثانوية الغد المشرق الشرعية - فرع جامع حموليلا:

 رقم الطالب: ${studentId}
 كلمة المرور: ${password}


 نقاط الطالب الحالية: ${points}

رابط تسجيل الدخول:
${websiteUrl}

احتفظ بهذه البيانات في مكان آمن! 
`.trim();
// =============================================

export default function AdminDashboard({ setAdmin }) {
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [games, setGames] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [selectedPurchases, setSelectedPurchases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchGames();
    fetchPurchases();
    fetchGrades();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/api/students");
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchGames = async () => {
    try {
      const { data } = await api.get("/api/games");
      setGames(data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data } = await api.get("/api/purchases");
      setPurchases(data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  const fetchGrades = async () => {
    try {
      const { data } = await api.get("/api/grades");
      setGrades(data);
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/students", form);
      setForm({});
      fetchStudents();
      alert("تم إضافة الطالب بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/grades", { name: form.gradeName });
      setForm({});
      fetchGrades();
      alert("تم إضافة الصف بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleDeleteGrade = async (id) => {
    if (!confirm("تأكيد حذف الصف?")) return;
    try {
      await api.delete(`/api/grades/${id}`);
      fetchGrades();
      fetchStudents();
      alert("تم الحذف بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/students/${editId}`, form);
      setForm({});
      setEditId(null);
      fetchStudents();
      alert("تم التعديل بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm("تأكيد الحذف؟")) return;
    try {
      await api.delete(`/api/students/${id}`);
      fetchStudents();
      alert("تم الحذف بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/games", form);
      setForm({});
      fetchGames();
      alert("تم إضافة اللعبة بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/games/${editId}`, form);
      setForm({});
      setEditId(null);
      fetchGames();
      alert("تم التعديل بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  const handleDeleteGame = async (id) => {
    if (!confirm("تأكيد الحذف؟")) return;
    try {
      await api.delete(`/api/games/${id}`);
      fetchGames();
      alert("تم الحذف بنجاح");
    } catch (err) {
      alert(err.response?.data?.error || "حدث خطأ");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src="/logo.jpg"
              alt="Logo"
              style={{ height: "60px", width: "auto" }}
            />
            <h1>
              برنامج النقاط في ثانوية الغد المشرق الشرعية - فرع جامع حموليلا
            </h1>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            تسجيل خروج
          </button>
        </div>

        <div className="tabs">
          <button
            onClick={() => setTab("students")}
            className={`tab-btn ${tab === "students" ? "active" : ""}`}
          >
            👥 الطلاب
          </button>
          <button
            onClick={() => setTab("grades")}
            className={`tab-btn ${tab === "grades" ? "active" : ""}`}
          >
            🏫 الصفوف
          </button>
          <button
            onClick={() => setTab("games")}
            className={`tab-btn ${tab === "games" ? "active" : ""}`}
          >
            🎯 الألعاب
          </button>
          <button
            onClick={() => setTab("purchases")}
            className={`tab-btn ${tab === "purchases" ? "active" : ""}`}
          >
            📦 المشتريات
          </button>
          <button
            onClick={() => setTab("reports")}
            className={`tab-btn ${tab === "reports" ? "active" : ""}`}
          >
            📊 التقارير
          </button>
        </div>

        <div className="content-card">
          {tab === "students" && (
            <div>
              <ExcelUpload onSuccess={fetchStudents} />

              <div className="form-section">
                <h2>{editId ? "تعديل" : "إضافة"} طالب</h2>
                <form
                  onSubmit={editId ? handleUpdateStudent : handleAddStudent}
                >
                  <div className="form-grid">
                    {!editId && (
                      <select
                        value={form.grade_id || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            grade_id: parseInt(e.target.value),
                          })
                        }
                        className="form-input"
                        required
                      >
                        <option value="">اختر الصف</option>
                        {grades.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      placeholder="الاسم"
                      value={form.name || ""}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="الشعبة (مثال: أ)"
                      value={form.section || ""}
                      onChange={(e) =>
                        setForm({ ...form, section: e.target.value })
                      }
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="رقم واتساب (مثال: 96170123456)"
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="النقاط"
                      value={form.points || ""}
                      onChange={(e) =>
                        setForm({ ...form, points: parseInt(e.target.value) })
                      }
                      className="form-input"
                      required
                    />
                    {editId && (
                      <input
                        type="number"
                        placeholder="الدين"
                        value={form.debt || ""}
                        onChange={(e) =>
                          setForm({ ...form, debt: parseInt(e.target.value) })
                        }
                        className="form-input"
                      />
                    )}
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      {editId ? "تعديل" : "إضافة"}
                    </button>
                    {editId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(null);
                          setForm({});
                        }}
                        className="btn-cancel"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="🔍 بحث عن طالب (الاسم أو الرقم)..."
                  value={form.searchStudent || ""}
                  onChange={(e) =>
                    setForm({ ...form, searchStudent: e.target.value })
                  }
                  className="form-input"
                  style={{ maxWidth: "400px" }}
                />
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>رقم الطالب</th>
                    <th>كلمة المرور</th>
                    <th>الاسم</th>
                    <th>الصف</th>
                    <th>الشعبة</th>
                    <th>النقاط</th>
                    <th>الدين</th>
                    <th>رقم الواتساب</th>
                    <th>واتساب</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(
                      (s) =>
                        !form.searchStudent ||
                        s.name.includes(form.searchStudent) ||
                        s.student_id.includes(form.searchStudent),
                    )
                    .map((s) => {
                      return (
                        <tr key={s.id}>
                          <td>{s.student_id}</td>
                          <td
                            style={{
                              color: "#667eea",
                              fontWeight: "600",
                              fontFamily: "monospace",
                            }}
                          >
                            {s.plain_password || "******"}
                          </td>
                          <td>{s.name}</td>
                          <td>{s.grade || "-"}</td>
                          <td>{s.section || "-"}</td>
                          <td>{s.points}</td>
                          <td
                            style={{
                              color: s.debt > 0 ? "#f5576c" : "#28a745",
                              fontWeight: "700",
                            }}
                          >
                            {s.debt > 0 ? `${s.debt} ⚠️` : "0 ✅"}
                          </td>
                          <td style={{ color: "#25D366", fontWeight: "600" }}>
                            {s.phone || "-"}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                const message = WHATSAPP_MESSAGE(
                                  s.name,
                                  s.student_id,
                                  s.plain_password,
                                  s.points,
                                  window.location.origin,
                                );
                                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, "_blank");
                              }}
                              style={{
                                padding: "0.5rem 1rem",
                                background: "#25D366",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              📱 إرسال
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setEditId(s.id);
                                setForm({
                                  name: s.name,
                                  grade: s.grade,
                                  section: s.section,
                                  points: s.points,
                                  debt: s.debt,
                                });
                              }}
                              className="btn-edit"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              className="btn-delete"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "grades" && (
            <div>
              <h2>🏫 إدارة الصفوف</h2>

              <div className="form-section">
                <h3>إضافة صف جديد</h3>
                <form onSubmit={handleAddGrade}>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="اسم الصف (مثال: الصف الأول)"
                      value={form.gradeName || ""}
                      onChange={(e) =>
                        setForm({ ...form, gradeName: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit">
                    إضافة صف
                  </button>
                </form>
              </div>

              <div>
                <h3>الصفوف الحالية</h3>
                {grades.map((grade) => {
                  const gradeStudents = students.filter(
                    (s) => s.grade_id === grade.id,
                  );
                  return (
                    <div
                      key={grade.id}
                      style={{
                        background: "#f8f9fa",
                        padding: "1.5rem",
                        borderRadius: "15px",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <h3 style={{ margin: 0, color: "#10b981" }}>
                          {grade.name} (ID: {grade.id}) - {gradeStudents.length}{" "}
                          طالب
                        </h3>
                        <button
                          onClick={() => handleDeleteGrade(grade.id)}
                          style={{
                            padding: "0.6rem 1.2rem",
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          🗑️ حذف الصف
                        </button>
                      </div>
                      {gradeStudents.length > 0 ? (
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>رقم الطالب</th>
                              <th>الاسم</th>
                              <th>الشعبة</th>
                              <th>النقاط</th>
                              <th>الدين</th>
                              <th>إجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gradeStudents.map((s) => (
                              <tr key={s.id}>
                                <td>{s.student_id}</td>
                                <td>{s.name}</td>
                                <td>{s.section || "-"}</td>
                                <td>{s.points}</td>
                                <td
                                  style={{
                                    color: s.debt > 0 ? "#f5576c" : "#28a745",
                                    fontWeight: "700",
                                  }}
                                >
                                  {s.debt > 0 ? `${s.debt} ⚠️` : "0 ✅"}
                                </td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setEditId(s.id);
                                      setForm({
                                        name: s.name,
                                        grade_id: s.grade_id,
                                        section: s.section,
                                        points: s.points,
                                        debt: s.debt,
                                      });
                                      setTab("students");
                                    }}
                                    className="btn-edit"
                                  >
                                    تعديل
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(s.id)}
                                    className="btn-delete"
                                  >
                                    حذف
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#999",
                            padding: "2rem",
                          }}
                        >
                          لا يوجد طلاب في هذا الصف
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "games" && (
            <div>
              <GamesExcelUpload onSuccess={fetchGames} />

              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="🔍 بحث عن لعبة..."
                  value={form.searchGame || ""}
                  onChange={(e) =>
                    setForm({ ...form, searchGame: e.target.value })
                  }
                  className="form-input"
                  style={{ maxWidth: "400px" }}
                />
              </div>

              <div className="form-section">
                <h2>{editId ? "تعديل" : "إضافة"} لعبة</h2>
                <form onSubmit={editId ? handleUpdateGame : handleAddGame}>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="اسم اللعبة"
                      value={form.name || ""}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                    <textarea
                      placeholder="الوصف"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="form-textarea"
                    />
                    <input
                      type="number"
                      placeholder="النقاط"
                      value={form.points || ""}
                      onChange={(e) =>
                        setForm({ ...form, points: parseInt(e.target.value) })
                      }
                      className="form-input"
                      required
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <label style={{ fontWeight: "600", color: "#333" }}>
                        الصورة:
                      </label>
                      <ImageUpload
                        onUpload={(url) => setForm({ ...form, image_url: url })}
                      />
                      <div style={{ textAlign: "center", color: "#999" }}>
                        أو
                      </div>
                      <input
                        type="text"
                        placeholder="رابط الصورة (مثل: https://example.com/image.jpg)"
                        value={form.image_url || ""}
                        onChange={(e) =>
                          setForm({ ...form, image_url: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      {editId ? "تعديل" : "إضافة"}
                    </button>
                    {editId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(null);
                          setForm({});
                        }}
                        className="btn-cancel"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="games-grid-admin">
                {games.filter(
                  (g) =>
                    !form.searchGame ||
                    g.name.includes(form.searchGame) ||
                    g.description?.includes(form.searchGame),
                ).length === 0 ? (
                  <div
                    className="empty-state"
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "3rem",
                      background: "#f8f9fa",
                      borderRadius: "15px",
                    }}
                  >
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                      🎮
                    </div>
                    <h3>لا توجد ألعاب بعد</h3>
                    <p>أضف أول لعبة من النموذج أعلاه</p>
                  </div>
                ) : (
                  games
                    .filter(
                      (g) =>
                        !form.searchGame ||
                        g.name.includes(form.searchGame) ||
                        g.description?.includes(form.searchGame),
                    )
                    .map((g) => (
                      <div key={g.id} className="game-card-admin">
                        {g.image_url && (
                          <div className="game-image-admin">
                            <img src={g.image_url} alt={g.name} />
                          </div>
                        )}
                        <div className="game-content-admin">
                          <h3>{g.name}</h3>
                          <p>{g.description}</p>
                          <p className="game-price-admin">{g.points} نقطة</p>
                          <div className="game-actions">
                            <button
                              onClick={() => {
                                setEditId(g.id);
                                setForm({
                                  name: g.name,
                                  description: g.description,
                                  points: g.points,
                                  image_url: g.image_url,
                                });
                              }}
                              className="btn-edit"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteGame(g.id)}
                              className="btn-delete"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {tab === "purchases" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <h2>سجل المشتريات</h2>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="text"
                    placeholder="🔍 بحث بالطالب أو اللعبة..."
                    value={form.searchPurchase || ""}
                    onChange={(e) =>
                      setForm({ ...form, searchPurchase: e.target.value })
                    }
                    className="form-input"
                    style={{ maxWidth: "300px", margin: 0 }}
                  />
                  {selectedPurchases.length > 0 && (
                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            `تأكيد حذف ${selectedPurchases.length} عملية شراء?\nسيتم إرجاع النقاط للطلاب`,
                          )
                        )
                          return;
                        try {
                          for (const id of selectedPurchases) {
                            await api.delete(`/api/purchases/${id}`);
                          }
                          alert(
                            `تم حذف ${selectedPurchases.length} عملية بنجاح`,
                          );
                          setSelectedPurchases([]);
                          fetchPurchases();
                          fetchStudents();
                        } catch (err) {
                          console.error("Delete error:", err);
                          alert(
                            err.response?.data?.error ||
                              "حدث خطأ: " + err.message,
                          );
                        }
                      }}
                      style={{
                        padding: "0.8rem 1.5rem",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      🗑️ حذف المحدد ({selectedPurchases.length})
                    </button>
                  )}
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedPurchases.length ===
                            purchases.filter(
                              (p) =>
                                !form.searchPurchase ||
                                p.students?.name.includes(
                                  form.searchPurchase,
                                ) ||
                                p.games?.name.includes(form.searchPurchase),
                            ).length && purchases.length > 0
                        }
                        onChange={(e) => {
                          const filtered = purchases.filter(
                            (p) =>
                              !form.searchPurchase ||
                              p.students?.name.includes(form.searchPurchase) ||
                              p.games?.name.includes(form.searchPurchase),
                          );
                          if (e.target.checked) {
                            setSelectedPurchases(filtered.map((p) => p.id));
                          } else {
                            setSelectedPurchases([]);
                          }
                        }}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "#667eea",
                          border: "2px solid #667eea",
                          borderRadius: "3px",
                        }}
                      />
                    </th>
                    <th>الطالب</th>
                    <th>اللعبة</th>
                    <th>النقاط</th>
                    <th>بالدين</th>
                    <th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases
                    .filter(
                      (p) =>
                        !form.searchPurchase ||
                        p.students?.name.includes(form.searchPurchase) ||
                        p.games?.name.includes(form.searchPurchase),
                    )
                    .map((p) => (
                      <tr
                        key={p.id}
                        style={{
                          background: selectedPurchases.includes(p.id)
                            ? "#fff3cd"
                            : "transparent",
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedPurchases.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPurchases([
                                  ...selectedPurchases,
                                  p.id,
                                ]);
                              } else {
                                setSelectedPurchases(
                                  selectedPurchases.filter((id) => id !== p.id),
                                );
                              }
                            }}
                            style={{
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              accentColor: "#667eea",
                              border: "2px solid #667eea",
                              borderRadius: "3px",
                            }}
                          />
                        </td>
                        <td>{p.students?.name}</td>
                        <td>{p.games?.name}</td>
                        <td>{p.points_paid}</td>
                        <td>{p.used_debt ? "نعم" : "لا"}</td>
                        <td>{new Date(p.created_at).toLocaleString("ar")}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "reports" && (
            <div>
              <h2>📊 التقارير والإحصائيات</h2>

              {/* تقرير حسب الصفوف */}
              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ marginBottom: "1.5rem", color: "#10b981" }}>
                  🏫 تقرير حسب الصفوف
                </h3>
                {(() => {
                  const gradeGroups = {};
                  students.forEach((student) => {
                    const grade = student.grade || "غير محدد";
                    if (!gradeGroups[grade]) gradeGroups[grade] = [];
                    gradeGroups[grade].push(student);
                  });

                  return Object.keys(gradeGroups)
                    .sort()
                    .map((grade) => {
                      const gradeStudents = gradeGroups[grade];
                      const gradePurchases = purchases.filter((p) =>
                        gradeStudents.some((s) => s.id === p.student_id),
                      );
                      const gamesSummary = {};
                      gradePurchases.forEach((p) => {
                        const gameName = p.games?.name || "غير معروف";
                        gamesSummary[gameName] =
                          (gamesSummary[gameName] || 0) + 1;
                      });

                      return (
                        <div
                          key={grade}
                          style={{
                            background: "#f8f9fa",
                            padding: "1.5rem",
                            borderRadius: "15px",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "1rem",
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                color: "#10b981",
                                fontSize: "1.3rem",
                              }}
                            >
                              {grade} ({gradeStudents.length} طالب)
                            </h4>
                            <button
                              onClick={() => {
                                const printContent = `<html dir="rtl"><head><title>تقرير ${grade}</title><style>body{font-family:Arial;padding:20px}h1{color:#10b981}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:10px;text-align:right}th{background:#10b981;color:white}.summary{background:#e8f5e9;padding:15px;border-radius:10px;margin:20px 0}</style></head><body><h1>🏫 تقرير ${grade}</h1><p><strong>عدد الطلاب:</strong> ${gradeStudents.length}</p><div class="summary"><h2>🎮 ملخص الألعاب المطلوبة</h2><table><thead><tr><th>اللعبة</th><th>العدد</th></tr></thead><tbody>${Object.entries(
                                  gamesSummary,
                                )
                                  .sort((a, b) => b[1] - a[1])
                                  .map(
                                    ([g, c]) =>
                                      `<tr><td>${g}</td><td style="font-weight:bold;color:#10b981">${c}</td></tr>`,
                                  )
                                  .join(
                                    "",
                                  )}</tbody></table></div><h2>👥 تفاصيل الطلاب</h2>${gradeStudents
                                  .map((s) => {
                                    const sp = purchases.filter(
                                      (p) => p.student_id === s.id,
                                    );
                                    return `<div style="margin:20px 0;padding:15px;background:#f8f9fa;border-radius:10px"><h3>${s.name} (${s.student_id})</h3>${sp.length > 0 ? `<table><thead><tr><th>اللعبة</th><th>النقاط</th><th>التاريخ</th></tr></thead><tbody>${sp.map((p, i) => `<tr><td>${p.games?.name}</td><td>${p.points_paid}</td><td>${new Date(p.created_at).toLocaleDateString("ar")}</td></tr>`).join("")}</tbody></table>` : '<p style="color:#999">لم يشتري بعد</p>'}</div>`;
                                  })
                                  .join(
                                    "",
                                  )}<p style="margin-top:30px;color:#666;font-size:0.9rem">تاريخ الطباعة: ${new Date().toLocaleString("ar")}</p></body></html>`;
                                const w = window.open(
                                  "",
                                  "",
                                  "width=800,height=600",
                                );
                                w.document.write(printContent);
                                w.document.close();
                                w.print();
                              }}
                              style={{
                                padding: "0.8rem 1.5rem",
                                background:
                                  "linear-gradient(135deg,#10b981 0%,#059669 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              🖨️ طباعة {grade}
                            </button>
                          </div>
                          <div
                            style={{
                              background: "white",
                              padding: "1rem",
                              borderRadius: "10px",
                              marginBottom: "1rem",
                            }}
                          >
                            <h5
                              style={{ margin: "0 0 0.8rem 0", color: "#333" }}
                            >
                              🎮 الألعاب المطلوبة:
                            </h5>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                              }}
                            >
                              {Object.entries(gamesSummary).length > 0 ? (
                                Object.entries(gamesSummary)
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([g, c]) => (
                                    <span
                                      key={g}
                                      style={{
                                        background:
                                          "linear-gradient(135deg,#10b981 0%,#059669 100%)",
                                        color: "white",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "20px",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {g}: {c}
                                    </span>
                                  ))
                              ) : (
                                <span style={{ color: "#999" }}>
                                  لا توجد مشتريات
                                </span>
                              )}
                            </div>
                          </div>
                          <details style={{ marginTop: "1rem" }}>
                            <summary
                              style={{
                                cursor: "pointer",
                                padding: "0.8rem",
                                background: "white",
                                borderRadius: "8px",
                                fontWeight: "600",
                                color: "#333",
                              }}
                            >
                              👥 عرض تفاصيل الطلاب ({gradeStudents.length})
                            </summary>
                            <div style={{ marginTop: "1rem" }}>
                              {gradeStudents.map((s) => {
                                const sp = purchases.filter(
                                  (p) => p.student_id === s.id,
                                );
                                return (
                                  <div
                                    key={s.id}
                                    style={{
                                      background: "white",
                                      padding: "1rem",
                                      borderRadius: "10px",
                                      marginBottom: "0.8rem",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      <strong>{s.name}</strong>
                                      <span
                                        style={{
                                          color: "#666",
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {s.student_id}
                                      </span>
                                    </div>
                                    {sp.length > 0 ? (
                                      <ul
                                        style={{
                                          margin: 0,
                                          paddingRight: "1.5rem",
                                          color: "#666",
                                        }}
                                      >
                                        {sp.map((p) => (
                                          <li key={p.id}>
                                            {p.games?.name} - {p.points_paid}{" "}
                                            نقطة
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p
                                        style={{
                                          margin: 0,
                                          color: "#999",
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        لم يشتري بعد
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      );
                    });
                })()}
              </div>

              <div style={{ marginBottom: "3rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3>🎮 إحصائيات الألعاب</h3>
                  <button
                    onClick={() => {
                      const lowStockGames = games
                        .map((game) => {
                          const soldCount = purchases.filter(
                            (p) => p.game_id === game.id,
                          ).length;
                          return { ...game, soldCount };
                        })
                        .filter((g) => g.soldCount > 0);

                      const printContent = `
                        <html dir="rtl">
                        <head>
                          <title>تقرير الألعاب المباعة</title>
                          <style>
                            body { font-family: Arial; padding: 20px; }
                            h1 { color: #667eea; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
                            th { background: #667eea; color: white; }
                            .high { background: #ffebee; }
                            .medium { background: #fff9c4; }
                            .low { background: #e8f5e9; }
                          </style>
                        </head>
                        <body>
                          <h1>📊 تقرير الألعاب المباعة</h1>
                          <p><strong>تاريخ التقرير:</strong> ${new Date().toLocaleString("ar")}</p>
                          <h2>الألعاب التي تحتاج إعادة تجهيز:</h2>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>اللعبة</th>
                                <th>الكمية المباعة</th>
                                <th>السعر</th>
                                <th>الحالة</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${lowStockGames
                                .map(
                                  (g, i) => `
                                <tr class="${g.soldCount >= 10 ? "high" : g.soldCount >= 5 ? "medium" : "low"}">
                                  <td>${i + 1}</td>
                                  <td>${g.name}</td>
                                  <td>${g.soldCount}</td>
                                  <td>${g.points} نقطة</td>
                                  <td>${g.soldCount >= 10 ? "❗ مطلوب بكثرة" : g.soldCount >= 5 ? "⚠️ مطلوب" : "✅ متوسط"}</td>
                                </tr>
                              `,
                                )
                                .join("")}
                            </tbody>
                          </table>
                          <p style="margin-top: 30px; color: #666; font-size: 0.9rem;">تاريخ الطباعة: ${new Date().toLocaleString("ar")}</p>
                        </body>
                        </html>
                      `;
                      const printWindow = window.open(
                        "",
                        "",
                        "width=800,height=600",
                      );
                      printWindow.document.write(printContent);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    style={{
                      padding: "0.8rem 1.5rem",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    📊 تقرير الألعاب المباعة
                  </button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اللعبة</th>
                      <th>الكمية المباعة</th>
                      <th>السعر</th>
                      <th>الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => {
                      const count = purchases.filter(
                        (p) => p.game_id === game.id,
                      ).length;
                      const total = count * game.points;
                      return (
                        <tr key={game.id}>
                          <td>{game.name}</td>
                          <td
                            style={{
                              color: "#667eea",
                              fontWeight: "700",
                              fontSize: "1.2rem",
                            }}
                          >
                            {count}
                          </td>
                          <td>{game.points} نقطة</td>
                          <td style={{ color: "#28a745", fontWeight: "700" }}>
                            {total} نقطة
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3>👥 مشتريات الطلاب</h3>
                  <input
                    type="text"
                    placeholder="🔍 بحث عن طالب..."
                    value={form.searchStudent || ""}
                    onChange={(e) =>
                      setForm({ ...form, searchStudent: e.target.value })
                    }
                    className="form-input"
                    style={{ maxWidth: "300px" }}
                  />
                </div>

                {students
                  .filter(
                    (s) =>
                      !form.searchStudent ||
                      s.name.includes(form.searchStudent) ||
                      s.student_id.includes(form.searchStudent),
                  )
                  .map((student) => {
                    const studentBuys = purchases.filter(
                      (p) => p.student_id === student.id,
                    );
                    const totalSpent = studentBuys.reduce(
                      (sum, p) => sum + p.points_paid,
                      0,
                    );

                    return (
                      <div
                        key={student.id}
                        style={{
                          background: "#f8f9fa",
                          padding: "1.5rem",
                          borderRadius: "15px",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1rem",
                          }}
                        >
                          <div>
                            <h4 style={{ margin: "0 0 0.3rem 0" }}>
                              {student.name}
                            </h4>
                            <span style={{ color: "#666", fontSize: "0.9rem" }}>
                              رقم الطالب: {student.student_id}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                background: "#667eea",
                                color: "white",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "15px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                              }}
                            >
                              {studentBuys.length} عملية
                            </span>
                            <span
                              style={{
                                background: "#28a745",
                                color: "white",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "15px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                              }}
                            >
                              {totalSpent} نقطة
                            </span>
                            {studentBuys.length > 0 && (
                              <button
                                onClick={() => {
                                  const printContent = `
                                <html dir="rtl">
                                <head>
                                  <title>تقرير مشتريات - ${student.name}</title>
                                  <style>
                                    body { font-family: Arial; padding: 20px; }
                                    h1 { color: #667eea; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                    th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
                                    th { background: #667eea; color: white; }
                                    .total { font-weight: bold; color: #28a745; }
                                  </style>
                                </head>
                                <body>
                                  <h1>📊 تقرير مشتريات</h1>
                                  <p><strong>الطالب:</strong> ${student.name}</p>
                                  <p><strong>رقم الطالب:</strong> ${student.student_id}</p>
                                  <p><strong>عدد العمليات:</strong> ${studentBuys.length}</p>
                                  <p class="total"><strong>إجمالي النقاط:</strong> ${totalSpent} نقطة</p>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>اللعبة</th>
                                        <th>النقاط</th>
                                        <th>التاريخ</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${studentBuys
                                        .map(
                                          (p, i) => `
                                        <tr>
                                          <td>${i + 1}</td>
                                          <td>${p.games?.name}</td>
                                          <td>${p.points_paid} نقطة</td>
                                          <td>${new Date(p.created_at).toLocaleDateString("ar")}</td>
                                        </tr>
                                      `,
                                        )
                                        .join("")}
                                    </tbody>
                                  </table>
                                  <p style="margin-top: 30px; color: #666; font-size: 0.9rem;">تاريخ الطباعة: ${new Date().toLocaleString("ar")}</p>
                                </body>
                                </html>
                              `;
                                  const printWindow = window.open(
                                    "",
                                    "",
                                    "width=800,height=600",
                                  );
                                  printWindow.document.write(printContent);
                                  printWindow.document.close();
                                  printWindow.print();
                                }}
                                style={{
                                  padding: "0.5rem 1rem",
                                  background: "#ffc107",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                }}
                              >
                                🖨️ طباعة
                              </button>
                            )}
                          </div>
                        </div>

                        {studentBuys.length > 0 ? (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            {studentBuys.map((purchase) => (
                              <li
                                key={purchase.id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "0.8rem",
                                  background: "white",
                                  borderRadius: "8px",
                                }}
                              >
                                <span>{purchase.games?.name}</span>
                                <span
                                  style={{
                                    color: "#667eea",
                                    fontWeight: "600",
                                  }}
                                >
                                  {purchase.points_paid} نقطة
                                </span>
                                <span
                                  style={{ color: "#999", fontSize: "0.85rem" }}
                                >
                                  {new Date(
                                    purchase.created_at,
                                  ).toLocaleDateString("ar")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p
                            style={{
                              textAlign: "center",
                              color: "#999",
                              fontStyle: "italic",
                              margin: "1rem 0",
                            }}
                          >
                            لم يشتري بعد
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
