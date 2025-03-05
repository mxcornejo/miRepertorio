const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3003;

// Middleware para parsear JSON
app.use(express.json());

// Ruta al archivo JSON
const repertorioPath = path.join(__dirname, "repertorio.json");

// Función para leer el JSON
const leerRepertorio = () => {
  try {
    const data = fs.readFileSync(repertorioPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Función para escribir en el JSON
const escribirRepertorio = (data) => {
  fs.writeFileSync(repertorioPath, JSON.stringify(data, null, 2));
};

// Ruta para devolver la página web
app.get("/", (req, res) => {
  res.send(
    '<h1>Bienvenido al Repertorio de la Escuela de Música "E-Sueño"</h1>'
  );
});

// Ruta para obtener todas las canciones
app.get("/canciones", (req, res) => {
  res.json(leerRepertorio());
});

// Ruta para agregar una nueva canción
app.post("/canciones", (req, res) => {
  const canciones = leerRepertorio();
  const nuevaCancion = req.body;
  nuevaCancion.id = canciones.length
    ? canciones[canciones.length - 1].id + 1
    : 1;
  canciones.push(nuevaCancion);
  escribirRepertorio(canciones);
  res.json({ message: "Canción agregada con éxito", nuevaCancion });
});

// Ruta para actualizar una canción
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = leerRepertorio();
  const index = canciones.findIndex((cancion) => cancion.id == id);
  if (index !== -1) {
    canciones[index] = { ...canciones[index], ...req.body };
    escribirRepertorio(canciones);
    res.json({
      message: "Canción actualizada con éxito",
      cancion: canciones[index],
    });
  } else {
    res.status(404).json({ message: "Canción no encontrada" });
  }
});

// Ruta para eliminar una canción
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  let canciones = leerRepertorio();
  const nuevaLista = canciones.filter((cancion) => cancion.id != id);
  if (nuevaLista.length !== canciones.length) {
    escribirRepertorio(nuevaLista);
    res.json({ message: "Canción eliminada con éxito" });
  } else {
    res.status(404).json({ message: "Canción no encontrada" });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
