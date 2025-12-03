// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminRoute from "./AdminRoute";

// Páginas Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";

// CRUD Usuarios
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUsersCreate from "@/pages/admin/AdminUsersCreate";
import AdminUsersEdit from "@/pages/admin/AdminUsersEdit";

// CRUD Perros
import AdminDogs from "@/pages/admin/AdminDogs";
import AdminDogsCreate from "@/pages/admin/AdminDogsCreate";
import AdminDogsEdit from "@/pages/admin/AdminDogsEdit";

// CRUD Eventos
import AdminEvents from "@/pages/admin/events/AdminEvents";
import AdminEventsCreate from "@/pages/admin/events/AdminEventsCreate";
import AdminEventsEdit from "@/pages/admin/events/AdminEventsEdit";

export default function AdminRoutes() {
  return (
    <AdminRoute>
      <Routes>
        {/* Dashboard Admin */}
        <Route path="/" element={<AdminDashboard />} />

        {/* CRUD Usuarios */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/create" element={<AdminUsersCreate />} />
        <Route path="users/edit/:id" element={<AdminUsersEdit />} />

        {/* CRUD Perros */}
        <Route path="dogs" element={<AdminDogs />} />
        <Route path="dogs/create" element={<AdminDogsCreate />} />
        <Route path="dogs/edit/:id" element={<AdminDogsEdit />} />

        {/* CRUD Eventos */}
        <Route path="events" element={<AdminEvents />} />
        <Route path="events/create" element={<AdminEventsCreate />} />
        <Route path="events/edit/:id" element={<AdminEventsEdit />} />
      </Routes>
    </AdminRoute>
  );
}
