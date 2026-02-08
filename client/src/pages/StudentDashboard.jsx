import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ImageModal from '../components/ImageModal';
import '../styles/StudentDashboard.css';

export default function StudentDashboard({ student, setStudent }) {
  const [games, setGames] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [cart, setCart] = useState([]);
  const [useDebt, setUseDebt] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchPurchases();
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const { data } = await api.get(`/api/students/${student.id}`);
      setCurrentStudent(data);
      setStudent(data);
      localStorage.setItem('student', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGames = async () => {
    try {
      const { data } = await api.get('/api/games');
      setGames(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data } = await api.get(`/api/purchases/student/${student.id}`);
      setPurchases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('token');
    setStudent(null);
    navigate('/');
  };

  const addToCart = (game) => {
    const existing = cart.find(item => item.id === game.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === game.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...game, quantity: 1}]);
    }
  };

  const removeFromCart = (gameId) => {
    setCart(cart.filter(item => item.id !== gameId));
  };

  const updateQuantity = (gameId, delta) => {
    setCart(cart.map(item => {
      if (item.id === gameId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? {...item, quantity: newQty} : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.points * item.quantity), 0);
  const basePoints = currentStudent.initial_points || currentStudent.points;
  const maxDebt = Math.floor(basePoints * 0.1);
  const availableDebt = maxDebt - currentStudent.debt;
  const totalAvailable = currentStudent.points + (useDebt ? availableDebt : 0);
  const remainingPoints = totalAvailable - cartTotal;

  const handleCheckout = async () => {
    if (cartTotal > totalAvailable) {
      alert('نقاط غير كافية');
      return;
    }

    if (!confirm(`تأكيد شراء ${cart.length} لعبة بمجموع ${cartTotal} نقطة؟`)) {
      return;
    }

    try {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i++) {
          await api.post('/api/purchases', {
            student_id: student.id,
            game_id: item.id,
            use_debt: useDebt && currentStudent.points < cartTotal
          });
        }
      }
      
      alert('تم الشراء بنجاح!');
      setCart([]);
      setUseDebt(false);
      fetchStudentData();
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    }
  };

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">🎮 PointsMarket</h1>
          <div className="nav-right">
            <span className="welcome">مرحباً، {currentStudent.name}</span>
            <button onClick={handleLogout} className="btn-logout">تسجيل خروج</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card points">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>نقاطك</h3>
              <p className="stat-value">{currentStudent.points}</p>
            </div>
          </div>
          
          <div className="stat-card debt">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>الدين الحالي</h3>
              <p className="stat-value" style={{ color: currentStudent.debt > 0 ? '#f5576c' : '#28a745' }}>
                {currentStudent.debt}
              </p>
            </div>
          </div>
          
          <div className="stat-card available">
            <div className="stat-icon">💳</div>
            <div className="stat-info">
              <h3>الدين المتاح</h3>
              <p className="stat-value">{availableDebt} / {maxDebt}</p>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="cart-section">
            <h2>🛒 السلة ({cart.length})</h2>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image_url || 'https://via.placeholder.com/60'} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.points} نقطة × {item.quantity}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id)} className="btn-remove-cart">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="debt-toggle" style={{
                background: availableDebt > 0 ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' : '#f0f0f0',
                padding: '1.5rem',
                borderRadius: '15px',
                border: availableDebt > 0 ? '3px solid #ff9a56' : '2px solid #ddd',
                marginBottom: '1rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: availableDebt > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '1.1rem'
                }}>
                  <input 
                    type="checkbox" 
                    checked={useDebt} 
                    onChange={(e) => setUseDebt(e.target.checked)}
                    disabled={availableDebt <= 0}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: availableDebt > 0 ? 'pointer' : 'not-allowed'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', color: '#333', marginBottom: '0.3rem' }}>
                      💳 استخدام الدين
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {availableDebt > 0 
                        ? `يمكنك التدين لحد ${availableDebt} نقطة إضافية إذا لم تكفي نقاطك`
                        : 'لا يوجد دين متاح'}
                    </div>
                  </div>
                </label>
              </div>
              <div className="cart-total" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '15px'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem' }}>
                    إجمالي السلة
                  </div>
                  <h3 style={{ margin: 0, color: '#667eea', fontSize: '1.8rem' }}>{cartTotal} نقطة</h3>
                  {remainingPoints < 0 && (
                    <div style={{ color: '#f5576c', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                      ⚠️ تحتاج {Math.abs(remainingPoints)} نقطة إضافية
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleCheckout} 
                  className="btn-checkout"
                  disabled={remainingPoints < 0}
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem'
                  }}
                >
                  {remainingPoints < 0 ? 'نقاط غير كافية' : '✅ تأكيد الشراء'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="games-section">
          <h2 className="section-title">🎯 الألعاب المتاحة</h2>
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div 
                  className="game-image" 
                  onClick={() => game.image_url && setSelectedImage({url: game.image_url, name: game.name})}
                  style={{ cursor: game.image_url ? 'pointer' : 'default' }}
                >
                  {game.image_url ? (
                    <img src={game.image_url} alt={game.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '4rem' }}>
                      🎮
                    </div>
                  )}
                </div>
                <div className="game-content">
                  <h3 className="game-title">{game.name}</h3>
                  <p className="game-description">{game.description}</p>
                  <div className="game-footer">
                    <span className="game-price">{game.points} نقطة</span>
                    <button 
                      onClick={() => addToCart(game)}
                      className="btn-buy"
                    >
                      إضافة للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="purchases-section">
          <h2 className="section-title">📦 مشترياتي</h2>
          <div className="purchases-list">
            {purchases.length === 0 ? (
              <p className="empty-state">لا توجد مشتريات بعد</p>
            ) : (
              purchases.map(purchase => (
                <div key={purchase.id} className="purchase-card">
                  <div className="purchase-info">
                    <h4>{purchase.games.name}</h4>
                    <p className="purchase-points">
                      {purchase.points_paid} نقطة
                      {purchase.used_debt && <span className="debt-badge">بالدين</span>}
                    </p>
                  </div>
                  <span className="purchase-date">
                    {new Date(purchase.created_at).toLocaleDateString('ar')}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {selectedImage && (
        <ImageModal 
          image={selectedImage.url} 
          name={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
