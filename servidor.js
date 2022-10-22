const express = require("express");
const handlebars = require("express-handlebars")
const productRouter = require("./src/routes/rutasProductos");
const { Server } = require("socket.io")
const Chat = require("./chatClienteServidor")
const claseChats = new Chat("chat.txt")
const Contenedor = require("./getItems")
const contenedorProducts = new Contenedor("productos.txt")
const PORT = process.env.PORT || 8080
const app = express()
const server = app.listen(PORT, () => { console.log(`Server ejecutado en puerto: ${PORT}`) });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine());

app.set("views", "./src/views")

app.set("view engine", "handlebars")

app.use("/", productRouter)


const io = new Server(server);

app.use(express.static(__dirname + "/src/views/layouts"))


io.on("connection", async(socket) => {
    try {
        const historicoDelChat = await claseChats.obtenerMensajes()
        socket.on("envioProducto", async(datoRecibido) => {
            try {
                await contenedorProducts.save(datoRecibido)
                actualizarProductos = await contenedorProducts.getAll()
                console.log(actualizarProductos)
                socket.emit("todosLosProductos", actualizarProductos)
            } catch (error) {
                res.status(500).send("Hubo un error en el Servidor")
            }
        })
        socket.broadcast.emit("newUser", socket.id)
        if (historicoDelChat) {
            socket.emit("todosLosMensajes", historicoDelChat)
        }
        socket.on("envioMensajesFront", async(datoCliente) => {
            try {
                await claseChats.agregarMensaje(datoCliente)
                const chatActivos = await claseChats.obtenerMensajes()
                io.sockets.emit("todosLosMensajes", chatActivos)
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
})