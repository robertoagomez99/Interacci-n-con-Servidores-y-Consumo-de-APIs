const url = 'http://localhost:3000/productos';
const resultado = document.getElementById('resultado');

// 🔁 Asegura que id y precio siempre sean números
function forzarNumeros(producto) {
  if (producto.id !== undefined) {
    producto.id = Number(producto.id);
  }
  if (producto.precio !== undefined) {
    producto.precio = Number(producto.precio);
  }
  return producto;
}
function verProductos() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      resultado.innerHTML = "<h3>Productos disponibles:</h3>" +
        data.map(p => `<p>ID ${p.id}: ${p.nombre} - $${p.precio}</p>`).join("");
    })
    .catch(error => {
      resultado.innerText = "Error al obtener productos: " + error;
    });
}

function crearProducto() {
  const nombre = document.getElementById('crear-nombre').value;
  const precio = parseFloat(document.getElementById('crear-precio').value);

  if (!nombre || isNaN(precio)) {
    resultado.innerText = "Completa nombre y precio válidos.";
    return;
  }
  fetch(url)
    .then(res => res.json())
    .then(productos => {
      const ids = productos.map(p => Number(p.id));
      const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

      const nuevo = forzarNumeros({ id: nuevoId, nombre, precio });

      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
    })
    .then(res => res.json())
    .then(data => {
      resultado.innerText = `✅ Producto "${data.nombre}" creado (ID ${data.id})`;
      document.getElementById('crear-nombre').value = '';
      document.getElementById('crear-precio').value = '';
      verProductos();
    })
    .catch(error => {
      resultado.innerText = "Error al crear producto: " + error.message;
    });
}
function actualizarProducto() {
  const id = document.getElementById('actualizar-id').value;
  const nombre = document.getElementById('actualizar-nombre').value;
  const precio = parseFloat(document.getElementById('actualizar-precio').value);

  if (!id || !nombre || isNaN(precio)) {
    resultado.innerText = "Ingresa ID, nombre y precio válidos.";
    return;
  }

  const actualizado = forzarNumeros({ id, nombre, precio });

  fetch(`${url}/${actualizado.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then(data => {
      resultado.innerText = `Producto ID ${actualizado.id} actualizado.`;
      document.getElementById('actualizar-id').value = '';
      document.getElementById('actualizar-nombre').value = '';
      document.getElementById('actualizar-precio').value = '';
      verProductos();
    })
    .catch(error => {
      resultado.innerText = "Error al actualizar: " + error.message;
    });
}
function eliminarProducto() {
  const id = parseInt(document.getElementById('eliminar-id').value);

  if (isNaN(id)) {
    resultado.innerText = "Ingresa un ID válido.";
    return;
  }

  fetch(`${url}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      resultado.innerText = `🗑 Producto ID ${id} eliminado.`;
      document.getElementById('eliminar-id').value = '';
      verProductos();
    })
    .catch(error => {
      resultado.innerText = "Error al eliminar: " + error.message;
    });
}

