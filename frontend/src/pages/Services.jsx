// ============================================================
// 💈 Services.jsx — Vista de servicios del spa canino
// ============================================================

import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Services() {
  // 🧠 Estados principales
  const [services, setServices] = useState([]);
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false); // ✅ nuevo: loader simple

  // ============================================================
  // 🔄 useEffect para obtener servicios al montar el componente
  // ============================================================
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('❌ Error al cargar servicios:', err);
      setMsg('Error cargando servicios');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🧩 Crear nuevo servicio (solo admin)
  // ============================================================
  const createService = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', 'Baño'); // 🔧 categoría fija por ahora
      if (file) fd.append('image', file);

      await api.post('/api/services', fd, {
        headers: { Authorization: `Bearer ${user?.token}` }, // ✅ asegúrate que AuthContext guarde el token
      });

      setMsg('✅ Servicio creado correctamente');
      setForm({ name: '', description: '', price: '' });
      setFile(null);
      fetchServices();
    } catch (err) {
      console.error('❌ Error creando servicio:', err);
      setMsg(err.response?.data?.message || 'Error creando servicio');
    }
  };

  // ============================================================
  // 🖼️ Renderizado principal
  // ============================================================
  return (
    <div className="container mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        💈 Servicios del Spa Canino
      </h2>

      {/* 🧱 Loader */}
      {loading && <p className="text-center text-gray-500">Cargando...</p>}

      {/* ⚙️ Panel de creación solo visible para admin */}
      {user?.role === 'admin' && (
        <div className="mb-6 p-4 bg-white rounded-2xl shadow">
          <h3 className="font-semibold mb-2 text-blue-700">Crear servicio (admin)</h3>
          <form onSubmit={createService} className="grid gap-2">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              placeholder="Precio"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
              Crear servicio
            </button>
            {msg && <div className="text-sm text-gray-600">{msg}</div>}
          </form>
        </div>
      )}

      {/* 🐾 Cards de servicios */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h4 className="font-semibold text-lg text-blue-700 mb-1">{s.name}</h4>
              <p className="text-gray-600 mb-2">{s.description}</p>
            </div>
            <p className="font-bold text-blue-500 text-xl mb-2">${s.price}</p>
            {s.imageUrl && (
              <img
                src={`${import.meta.env.VITE_API_URL}${s.imageUrl}`}
                alt={s.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


