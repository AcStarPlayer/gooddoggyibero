// src/components/DogForm.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DogForm({ dog = null, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(dog?.nombre || "");
  const [raza, setRaza] = useState(dog?.raza || "");
  const [edad, setEdad] = useState(dog?.edad || "");
  const [descripcion, setDescripcion] = useState(dog?.descripcion || "");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(
    dog?.foto ? `${import.meta.env.VITE_BASE_URL}${dog.foto}` : null
  );

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("nombre", nombre);
    form.append("raza", raza);
    form.append("edad", edad);
    form.append("descripcion", descripcion);

    if (foto) form.append("foto", foto);

    onSubmit(form); // el padre maneja createDog o updateDog
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md"
    >
      <div>
        <label className="font-semibold">Nombre</label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa el Nombre de tu Mascota"
          required
        />
      </div>

      <div>
        <label className="font-semibold">Raza</label>
        <Input
          value={raza}
          onChange={(e) => setRaza(e.target.value)}
          placeholder="Ingresa la Raza de tu Mascota"
        />
      </div>

      <div>
        <label className="font-semibold">Edad</label>
        <Input
          type="number"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          placeholder="Ingresa la Edad de tu Mascota"
        />
      </div>

      <div>
        <label className="font-semibold">Descripción</label>
        <Textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripcion Breve de tu Mascota Ej: Jugueton, con 3 medallas olimpicas."
        />
      </div>

      <div>
        <label className="font-semibold">Foto</label>
        <Input type="file" accept="image/*" onChange={handleImage} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-40 mt-2 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex gap-3 pt-3">
        <Button type="submit" className="w-full">
          {dog ? "Actualizar Mascota" : "Registrar Mascota"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
