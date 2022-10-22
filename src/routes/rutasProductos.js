const express = require("express")
const Contenedor = require("../../getItems")
const productRouter = express.Router();

const contenedorProducts = new Contenedor("productos.txt")


productRouter.get("/", async(req, res) => {
    const allProducts = await contenedorProducts.getAll()
    res.render('home', { customers: allProducts });

})



productRouter.post("/products", async(req, res) => {
    try {
        const newProduct = req.body;
        if (newProduct.title == "" || newProduct.price == "" || newProduct.thumbnail == "") {
            res.redirect("/")
        } else {
            productoAAgregar = await contenedorProducts.save(newProduct)
            res.redirect("/")
        }
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }
})
productRouter.get("/products", async(req, res) => {
    try {
        const allProducts = await contenedorProducts.getAll()
        res.render("listProducts", { customers: allProducts })
    } catch (error) {
        res.status(500).send("Hubo un error en el Servidor")
    }

})


module.exports = productRouter