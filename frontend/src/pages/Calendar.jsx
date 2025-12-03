// src/pages/Calendar.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
//import { getEvents, createEvent } from "../services/eventsService";
//import { getEvents, createEvent, deleteEvent as removeEvent } from "../services/eventsService";
import { getEvents, createEvent, deleteEvent } from "../services/eventsService";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [todayEvent, setTodayEvent] = useState(null); // 🆕 Para mostrar la cita del día
  const [selectedEvent, setSelectedEvent] = useState(null); // evento seleccionado
  const [showDeleteModal, setShowDeleteModal] = useState(false); // abrir modal
  const [newEvent, setNewEvent] = useState({
    date: "",
    type: "",
    dogName: "",
    time: "",
    owner: "",
  });

  // 🧠 Cargar eventos desde la API
  const loadEvents = async () => {
    try {
      const data = await getEvents();
      const formatted = data.map((e) => ({
        id: e._id,
        title: `${e.type} - ${e.dogName}`,
        date: e.date,
        extendedProps: {
          type: e.type,
          dogName: e.dogName,
          time: e.time,
          owner: e.owner,
        },
      }));
      setEvents(formatted);

      // 🆕 Buscar si hay eventos para hoy
      const todayStr = new Date().toISOString().split("T")[0];
      const todayEvt = data.find((e) => e.date.split("T")[0] === todayStr);
      setTodayEvent(todayEvt || null);
    } catch (err) {
      console.error("❌ Error cargando eventos:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // 📅 Al hacer clic en una fecha
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setNewEvent({ ...newEvent, date: info.dateStr });
    setShowForm(true);
  };

  // 🐶 Crear evento nuevo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(newEvent);
      alert("✅ Cita agendada correctamente");
      setShowForm(false);
      loadEvents();
    } catch (err) {
      alert("❌ Error al guardar cita");
      console.error(err);
    }
  };


  // 🗑️ Eliminar evento lo comento por el modal
  //const handleDelete = async (eventId) => {
    //if (!window.confirm("¿Eliminar este evento?")) return;

    //try {
      //await removeEvent(eventId);
      //loadEvents();
    //} catch (err) {
      //console.error("❌ Error eliminando evento:", err);
      //alert("No se pudo eliminar el evento");
    //}
  //};

  const handleDelete = async () => {
    try {
      await deleteEvent(selectedEvent.id);
      alert("🗑️ Evento eliminado correctamente");
      setShowDeleteModal(false);
      loadEvents();
    } catch (err) {
      console.error("❌ Error eliminando evento:", err);
      alert("Error eliminando evento");
    }
  };

  // 📋 Mostrar información al hacer clic sobre un evento
  //const handleEventClick = (info) => {
    //const e = info.event.extendedProps;
    //alert(
      //`📅 ${info.event.title}\n\n` +
        //`🐶 Canino: ${e.dogName}\n` +
        //`🕒 Hora: ${e.time}\n` +
        //`👤 Dueño: ${e.owner}\n` +
        //`📆 Fecha: ${info.event.startStr}`
    //);
  //};

  //comente todo esto para probar el modal
  //const handleEventClick = (info) => {
  //const e = info.event.extendedProps;

  //const msg =
    //`📅 ${info.event.title}\n\n` +
    //`🐶 Canino: ${e.dogName}\n` +
    //`🕒 Hora: ${e.time}\n` +
    //`👤 Dueño: ${e.owner}\n` +
    //`📆 Fecha: ${info.event.startStr}\n\n` +
    //`¿Qué deseas hacer?\n\n` +
    //`1️⃣ Ver información\n` +
    //`2️⃣ Eliminar evento`;

  //const option = prompt(msg);

  //if (option === "2") {
    //handleDelete(info.event.id);
  //}
//};

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      date: info.event.startStr,
      ...info.event.extendedProps,
    });
    setShowDeleteModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 🔸 Sidebar izquierda
      <aside className="bg-[#F59E0B] w-1/5 text-black flex flex-col justify-between p-6">
        <nav>
          <ul className="space-y-4 font-semibold">
            <li>Mi Perfil</li>
            <li>
              Doggys
              <ul className="ml-4 mt-2 space-y-2 text-sm font-normal">
                <li>Doggy 1</li>
                <li>Doggy 2</li>
              </ul>
            </li>
            <li>Directorio</li>
            <li>Comunidad</li>
            <li className="font-bold underline text-gray-900">Calendario</li>
            <li>Doggy perdido</li>
          </ul>
        </nav>
        <button className="underline font-medium hover:text-gray-800">
          Cerrar sesión
        </button>
      </aside>*/}

      {/* 🧭 Contenido principal */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Calendario</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="75vh"
          />
        </div>
      </main>

      {/* 🆕 Panel lateral derecho (alerta del día) */}
      <aside className="bg-[#127C87] text-white w-1/4 p-8 flex flex-col justify-center rounded-l-2xl shadow-lg">
        {todayEvent ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">📅 Cita del día</h2>
            <p className="text-center text-lg">
              <span className="font-semibold">Fecha:</span> {todayEvent.date}
            </p>
            <p className="text-center text-lg">
              <span className="font-semibold">Tipo:</span> {todayEvent.type}
            </p>
            <p className="text-center text-lg">
              <span className="font-semibold">Canino:</span> {todayEvent.dogName}
            </p>
            <p className="text-center text-lg">
              <span className="font-semibold">Hora:</span> {todayEvent.time}
            </p>
            {todayEvent.owner && (
              <p className="text-center text-lg">
                <span className="font-semibold">Dueño:</span> {todayEvent.owner}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">📅 Sin citas hoy</h2>
            <p>No hay citas programadas para hoy 💤</p>
          </div>
        )}
        
      </aside>

      {/* 🧾 Modal formulario para nueva cita */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl w-96"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Nueva cita 🐾
            </h3>

            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Tipo de cita"
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="dogName"
              placeholder="Nombre del canino"
              onChange={(e) =>
                setNewEvent({ ...newEvent, dogName: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="time"
              placeholder="Hora"
              onChange={(e) =>
                setNewEvent({ ...newEvent, time: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="owner"
              placeholder="Dueño"
              onChange={(e) =>
                setNewEvent({ ...newEvent, owner: e.target.value })
              }
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-3 py-1 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#127C87] text-white px-3 py-1 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
      {showDeleteModal && selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
        ¿Eliminar cita?
      </h2>

      <p className="text-gray-700 text-center mb-4">
        <span className="font-semibold">Evento:</span> {selectedEvent.title}<br />
        <span className="font-semibold">Fecha:</span> {selectedEvent.date}<br />
        <span className="font-semibold">Hora:</span> {selectedEvent.time}
      </p>

      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancelar
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
