import { useState } from 'react'

export default function LavadoManual() {
  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    placas: '',
    telefono: '',
    marca: '',
    modelo: '',
    color: '',
    tipoVehiculo: '',
    especificaciones: '',
  })

  const [errors, setErrors] = useState({})
  const [servicioIniciado, setServicioIniciado] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'Nombre requerido'
    if (!form.apellidoPaterno.trim()) newErrors.apellidoPaterno = 'Apellido paterno requerido'
    if (!form.apellidoMaterno.trim()) newErrors.apellidoMaterno = 'Apellido materno requerido'
    if (!form.placas.trim()) newErrors.placas = 'Número de placas requerido'
    if (!form.telefono.trim()) newErrors.telefono = 'Teléfono requerido'
    if (!form.marca.trim()) newErrors.marca = 'Marca requerida'
    if (!form.modelo.trim()) newErrors.modelo = 'Modelo requerido'
    if (!form.color.trim()) newErrors.color = 'Color requerido'
    if (!form.tipoVehiculo.trim()) newErrors.tipoVehiculo = 'Tipo de vehículo requerido'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validate()
    setErrors(validation)
    if (Object.keys(validation).length === 0) {
      setServicioIniciado(true)
      setSubmittedData(form)
      console.log('Servicio iniciado:', form)
      // Aquí podrías enviar datos al servidor con fetch/axios
    }
  }

  function handleReset() {
    setForm({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      placas: '',
      telefono: '',
      marca: '',
      modelo: '',
      color: '',
      tipoVehiculo: '',
      especificaciones: '',
    })
    setErrors({})
    setServicioIniciado(false)
    setSubmittedData(null)
  }

  return (
    <div>
      <h2>Lavado manual</h2>
      {servicioIniciado && submittedData ? (
        <div className="service-summary">
          <h3>Servicio iniciado</h3>
          <p>
            <strong>Cliente:</strong> {submittedData.nombre} {submittedData.apellidoPaterno} {submittedData.apellidoMaterno}
          </p>
          <p>
            <strong>Placas:</strong> {submittedData.placas}
          </p>
          <p>
            <strong>Teléfono:</strong> {submittedData.telefono}
          </p>
          <p>
            <strong>Vehículo:</strong> {submittedData.marca} {submittedData.modelo} — {submittedData.color} ({submittedData.tipoVehiculo})
          </p>
          {submittedData.especificaciones && (
            <p>
              <strong>Especificaciones:</strong> {submittedData.especificaciones}
            </p>
          )}
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={handleReset}>
              Nuevo servicio
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="nombre">Nombre de Cliente</label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            {errors.nombre && <small style={{ color: 'red' }}>{errors.nombre}</small>}
          </div>

          <div>
            <label htmlFor="apellidoPaterno">Apellido paterno</label>
            <input
              id="apellidoPaterno"
              name="apellidoPaterno"
              value={form.apellidoPaterno}
              onChange={handleChange}
              placeholder="Apellido paterno"
              required
            />
            {errors.apellidoPaterno && <small style={{ color: 'red' }}>{errors.apellidoPaterno}</small>}
          </div>

          <div>
            <label htmlFor="apellidoMaterno">Apellido materno</label>
            <input
              id="apellidoMaterno"
              name="apellidoMaterno"
              value={form.apellidoMaterno}
              onChange={handleChange}
              placeholder="Apellido materno"
              required
            />
            {errors.apellidoMaterno && <small style={{ color: 'red' }}>{errors.apellidoMaterno}</small>}
          </div>

          <div>
            <label htmlFor="placas">Número de placas</label>
            <input
              id="placas"
              name="placas"
              value={form.placas}
              onChange={handleChange}
              placeholder="ABC-1234"
              required
            />
            {errors.placas && <small style={{ color: 'red' }}>{errors.placas}</small>}
          </div>

          <div>
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="(555) 555-5555"
              required
            />
            {errors.telefono && <small style={{ color: 'red' }}>{errors.telefono}</small>}
          </div>

          <div>
            <label htmlFor="marca">Marca del vehículo</label>
            <input
              id="marca"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              placeholder="Toyota, Ford, etc."
              required
            />
            {errors.marca && <small style={{ color: 'red' }}>{errors.marca}</small>}
          </div>

          <div>
            <label htmlFor="modelo">Modelo del vehículo</label>
            <input
              id="modelo"
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              placeholder="Corolla, Civic, etc."
              required
            />
            {errors.modelo && <small style={{ color: 'red' }}>{errors.modelo}</small>}
          </div>

          <div>
            <label htmlFor="color">Color del vehículo</label>
            <input
              id="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Rojo, Blanco, etc."
              required
            />
            {errors.color && <small style={{ color: 'red' }}>{errors.color}</small>}
          </div>

          <div>
            <label htmlFor="tipoVehiculo">Tipo de vehículo</label>
            <select
              id="tipoVehiculo"
              name="tipoVehiculo"
              value={form.tipoVehiculo}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona...</option>
              <option value="sedan">Sedán</option>
              <option value="minivan">Minivan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupe</option>
              <option value="sport">Sport</option>
              <option value="camioneta pickup">Camioneta pickup</option>
              <option value="van">VAN</option>
            </select>
            {errors.tipoVehiculo && <small style={{ color: 'red' }}>{errors.tipoVehiculo}</small>}
          </div>

          <div>
            <label htmlFor="especificaciones">Especificaciones del vehículo</label>
            <textarea
              id="especificaciones"
              name="especificaciones"
              value={form.especificaciones}
              onChange={handleChange}
              placeholder="Colocar detalles adicionales, manchas, daños, accesorios, etc."
              rows={4}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit">Inicio de servicio</button>
            <button type="button" onClick={handleReset} style={{ marginLeft: 8 }}>
              Limpiar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}