const fs = require("fs")


class Chat {
    constructor(nameFile) {
        this.nameFile = nameFile
    }

    agregarMensaje = async(newMsj) => {
        try {
            if (fs.existsSync(this.nameFile)) {
                const contenidoChat = await fs.promises.readFile(this.nameFile, "utf-8");
                if (contenidoChat) {
                    console.log(contenidoChat)
                    const contenidoChatJson = JSON.parse(contenidoChat)
                    contenidoChatJson.push(newMsj)
                    await fs.promises.writeFile(this.nameFile, JSON.stringify(contenidoChatJson, null, 2))
                } else {
                    await fs.promises.writeFile(this.nameFile, JSON.stringify([newMsj], null, 2));
                    console.log("Se ingresan datos en el archivo solicitado.")
                }
            } else {
                await fs.promises.writeFile(this.nameFile, JSON.stringify([newMsj], null, 2));
                console.log("Se Crear el archivo solicitado, y se le ingresa el primer dato.")
            }
        } catch (error) {
            console.log(error)
        }
    }


    obtenerMensajes = async() => {
        try {
            if (fs.existsSync(this.nameFile)) {
                const chatGuardados = await fs.promises.readFile(this.nameFile, "utf-8")
                if (chatGuardados) {
                    const chatGuardadosJSON = JSON.parse(chatGuardados)
                    return chatGuardadosJSON
                } else {
                    console.log("El archivo esta vacio")
                }
            } else {
                console.log("El archivo no existe")
            }
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = Chat