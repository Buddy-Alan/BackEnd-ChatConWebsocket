const fs = require("fs");

class Contenedor {
    constructor(nameFile) {
        this.nameFile = nameFile;
    }

    save = async(productoAAgregar) => {
            try {
                //Es un if que se usa para comprobar si existe el archivo
                if (fs.existsSync(this.nameFile)) {
                    const contenidoArchivo = await fs.promises.readFile(this.nameFile, "utf-8");
                    if (contenidoArchivo) {
                        const productosJSON = JSON.parse(contenidoArchivo);
                        const productExists = productosJSON.some(item => item.title === productoAAgregar.title);
                        //Se realiza un if para filtrar productos ya cargados, con el fin de que no se repitan datos
                        if (productExists) {
                            return false
                        } else {
                            const newProduct = {
                                id: productosJSON[productosJSON.length - 1].id + 1,
                                ...productoAAgregar
                            }
                            productosJSON.push(newProduct)
                            await fs.promises.writeFile(this.nameFile, JSON.stringify(productosJSON, null, 2))
                        }
                    } else {
                        const newProduct = {
                            id: 1,
                            ...productoAAgregar
                        }
                        await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
                        console.log("Se le carga los primeros datos al archivo solicitado.")
                    }
                } else {
                    let newProduct = {
                        id: 1,
                        ...productoAAgregar
                    }
                    await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
                    console.log("Se Crear el archivo solicitado, y se le ingresa el primer dato.")
                }
            } catch (error) {
                console.log(error)
            }
        } //Aca termina la funcion Save()



    getByID = async(id) => {
        try {
            //If para comprobar si el archivo existe
            if (fs.existsSync(this.nameFile)) {
                const contenidoDelArchivo = await fs.promises.readFile(this.nameFile, "utf-8")
                    //If para comprobar si el archivo esta vacio
                if (contenidoDelArchivo) {
                    const contenidoEnJSON = JSON.parse(contenidoDelArchivo)
                    const productoSolicitado = contenidoEnJSON.find(item => item.id === id)
                        //If para comprobar si el archivo tiene le ID solicitado
                    if (productoSolicitado != undefined) {
                        return productoSolicitado
                    }
                } else {
                    console.log("el archivo esta vacio")
                } //fin del if para comprobar si el archivo esta vacio
            } else {
                console.log("El archivo no existe")
            } // Fin del if para comprabar si el archivo existe

        } catch (error) {
            console.log(error)
        }
    }


    getAll = async() => {
        try {
            //If para comprobar si el archivo existe
            if (fs.existsSync(this.nameFile)) {
                const contenidoDelArchivo = await fs.promises.readFile(this.nameFile, "utf-8")
                    //If para comprobar si el archivo esta vacio
                if (contenidoDelArchivo) {
                    const contenidoEnJSON = JSON.parse(contenidoDelArchivo)
                        //If para comprobar si el archivo tiene le ID solicitado
                    return contenidoEnJSON
                        //fin del if para comprobar si existe ID
                } else {
                    console.log("el archivo esta vacio")
                } //fin del if para comprobar si el archivo esta vacio
            } else {
                console.log("El archivo no existe")
            } // Fin del if para comprabar si el archivo existe

        } catch (error) {
            console.log(error)
        }
    }




    updateById = async(id, body) => {

        try {
            const productos = await this.getAll();
            const indexDeProducto = productos.findIndex(elm => elm.id === id);
            if (indexDeProducto == -1) {
                return undefined
            } else {
                productos[indexDeProducto] = {
                    id: id,
                    ...body
                };
                await fs.promises.writeFile(this.nameFile, JSON.stringify(productos, null, 2))
                return productos;
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteByID = async(idAEliminar) => {
        try {
            //If para comprobar si el archivo existe
            if (fs.existsSync(this.nameFile)) {
                const contenidoDelArchivo = await fs.promises.readFile(this.nameFile, "utf-8")
                    //If para comprobar si el archivo esta vacio
                if (contenidoDelArchivo) {
                    const contenidoEnJSON = JSON.parse(contenidoDelArchivo)
                    const productoAEliminar = contenidoEnJSON.find(item => item.id === idAEliminar)
                        //If para comprobar si el archivo tiene le ID solicitado
                    if (productoAEliminar != undefined) {
                        const nuevoArrayDeProductos = contenidoEnJSON.filter(item => item.id != idAEliminar)
                        await fs.promises.writeFile(this.nameFile, JSON.stringify(nuevoArrayDeProductos, null, 2))
                        return ("El producto Eliminado es: " + productoAEliminar.title)
                    } else {
                        return (`El ID: ${idAEliminar}, no se puede eliminar ya que no existe`)
                    } //fin del if para comprobar si existe ID
                } else {
                    console.log("el archivo esta vacio")
                } //fin del if para comprobar si el archivo esta vacio
            } else {
                console.log("El archivo no existe")
            } // Fin del if para comprabar si el archivo existe

        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = Contenedor