// =======================================================
// App.jsx — Router FINAL ORGANIZADO (Admin + Usuario)
// =======================================================

import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthProvider, { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import AdminLayout from "./layouts/AdminLayout";

import { ToastProviderCustom } from "@/components/ui/use-toast";
import { ToasterCustom } from "@/components/ui/ToasterCustom";

// ====================
// Páginas Públicas
// ====================
import Login from "./pages/Login";
import Register from "./pages/Register";

// ====================
// Admin
// ====================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminVeterinarias from "./pages/Admin/AdminVeterinarias";


import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUsersCreate from "./pages/Admin/AdminUsersCreate";
import AdminUsersEdit from "./pages/Admin/AdminUsersEdit";
import AdminUsersDetail from "./pages/Admin/AdminUsersDetail";

//import VeterinariasCreate from "./pages/Admin/VeterinariasCreate";
//import VeterinariasEdit from "./pages/Admin/VeterinariasEdit";
//import VeterinariasDetail from "./pages/Admin/VeterinariasDetail";

import VeterinariasCreate from "./pages/Admin/veterinarias/VeterinariasCreate";
import VeterinariasEdit from "./pages/Admin/veterinarias/VeterinariasEdit";
import VeterinariasDetail from "./pages/Admin/veterinarias/VeterinariasDetail";

// Admin — LostPets CRUD
// ========================
import AdminLostPets from "./pages/Admin/AdminLostPets";
import AdminLostPetsCreate from "./pages/Admin/AdminLostPetsCreate";
import AdminLostPetsEdit from "./pages/Admin/AdminLostPetsEdit";

// ====================
// Usuario
// ====================
import DashboardLayout from "./pages/DashboardLayout";
import Welcome from "./pages/Welcome";
import UserDashboard from "./pages/UserDashboard";
import Community from "./pages/Community";
import Alerts from "./pages/Alerts";
import Services from "./pages/Services";
import LostPets from "./pages/LostPets";
import AddLostPet from "./pages/AddLostPet";
import LostPetCreate from "./pages/LostPetCreate";
import CommunityPost from "./pages/CommunityPost";

import Perfil from "./pages/perfil/Perfil";
import EditarPerfil from "./pages/perfil/EditarPerfil";
import Calendar from "./pages/Calendar";

// Mascotas
import MisMascotas from "./pages/MisMascotas";
import RegistrarMascota from "./pages/RegistrarMascota";
import EditarMascota from "./pages/EditarMascota";
import VerMascotaCompleta from "./pages/mascotas/VerMascotaCompleta";
import VeterinariasList from "./pages/VeterinariasList";
import VeterinariaForm from "./pages/VeterinariaForm";
import VeterinariaReviews from "./pages/VeterinariaReviews";


function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // ===========================================================
  // ⛔ Si NO está logueado → solo puede ir a Login/Register
  // ===========================================================
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ===========================================================
  // 👑 MODO ADMIN
  // ===========================================================
  if (user.role === "admin") {
    return (
      //<main className="container mx-auto px-4 py-6">
        <Routes>

          {/* Dashboard Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            {/* Dashboard (ruta index) */}
            <Route index element={<AdminDashboard />} />

            {/* CRUD USERS */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<AdminUsersCreate />} />
            <Route path="users/edit/:id" element={<AdminUsersEdit />} />
            <Route path="users/:id" element={<AdminUsersDetail />} />

            {/*<Route path="users" element={<h1>Usuarios (pendiente)</h1>} />*/}
            <Route path="dogs" element={<h1>Perros (pendiente)</h1>} />
            <Route path="events" element={<h1>Eventos (pendiente)</h1>} />

            {/* CRUD veterinarias */}
            <Route path="veterinarias" element={<AdminVeterinarias />} />
            <Route path="veterinarias/create" element={<VeterinariasCreate />} />
            <Route path="veterinarias/edit/:id" element={<VeterinariasEdit />} />
            <Route path="veterinarias/:id" element={<VeterinariasDetail />} />

            <Route path="lostpets" element={<AdminLostPets />} />
            <Route path="lostpets/create" element={<AdminLostPetsCreate />} />
            <Route path="lostpets/edit/:id" element={<AdminLostPetsEdit />} />


          </Route>
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      //</main>
    );
  }

  // ===========================================================
  // 🧑‍🤝‍🧑 MODO USUARIO
  // ===========================================================
  return (
    <main className="container mx-auto px-4 py-6">
      <Routes>

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD DEL USUARIO */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="perfil/editar" element={<EditarPerfil />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="community" element={<Community />} />
          <Route path="lostpets" element={<LostPets />} />
          <Route path="lostpets/create" element={<LostPetCreate />} />

          {/* Mascotas */}
          <Route path="mis-mascotas" element={<MisMascotas />} />
          <Route path="mis-mascotas/registrar" element={<RegistrarMascota />} />
          <Route path="mis-mascotas/:id" element={<VerMascotaCompleta />} />
          <Route path="mis-mascotas/:id/editar" element={<EditarMascota />} />

          {/* Veterinarias del usuario */}
          <Route path="directorio" element={<VeterinariasList />} />
          <Route path="crear-veterinaria" element={<VeterinariaForm />} />
          <Route path="veterinaria/:id/reviews" element={<VeterinariaReviews />} />
        </Route>

        <Route path="/community/:id" element={<ProtectedRoute><CommunityPost /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/add-lost-pet" element={<ProtectedRoute><AddLostPet /></ProtectedRoute>} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </main>
  );
}


// ===========================================================
// Wrapper
// ===========================================================
export default function App() {
  return (
    <AuthProvider>
      <ToastProviderCustom>
        <BrowserRouter>
          <AppRoutes />
          <ToasterCustom />
        </BrowserRouter>
      </ToastProviderCustom>
    </AuthProvider>
  );
}
