export default function VetForm({ values, setValues, onSubmit, buttonText }) {
  return (
    <form onSubmit={onSubmit} className="mt-3">

      <div className="mb-3">
        <label>Nombre</label>
        <input
          type="text"
          className="form-control"
          value={values.nombre}
          onChange={e => setValues({ ...values, nombre: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label>Dirección</label>
        <input
          type="text"
          className="form-control"
          value={values.direccion}
          onChange={e => setValues({ ...values, direccion: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label>Teléfono</label>
        <input
          type="text"
          className="form-control"
          value={values.telefono}
          onChange={e => setValues({ ...values, telefono: e.target.value })}
          required
        />
      </div>

      <button className="btn btn-success">{buttonText}</button>
    </form>
  );
}
