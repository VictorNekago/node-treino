const express = require('express')
const { route } = require('express/lib/application')
const routes = express.Router()




// conectando ao banco de dados
const Sequelize = require("sequelize")
const sequelize = new Sequelize("sensores", "root", "12345", {
    host: "localhost",
    dialect: "mysql"
})
sequelize.authenticate().then(function () {
    console.log("conectado com sucesso!")
}).catch(function (erro) {
    console.log("falha ao se conectar " + erro)
})



const sensorModel = sequelize.define('dados_sensores', {
    Id: {
        type: Sequelize.INTEGER
    },
    Nome: {
        type: Sequelize.STRING
    },
    Tamanho: {
        type: Sequelize.STRING
    },
    Tensao: {
        type: Sequelize.STRING
    },
    Marca: {
        type: Sequelize.STRING
    },
    Tipo: {
        type: Sequelize.STRING
    }
}, { timestamps: false })







routes.get('/', (req, res) => {



    sensorModel.findAll({ raw: true }).then(function (data) {
        return res.json(data)

    });


})





routes.post("/add", (req, res) => {

    try {
        const body = req.body
        const validarTamanho = body.Tamanho != ('3,3,3') && body.Tamanho != ('1,2,2')
        if (!body || validarTamanho) {
            throw ("Dados Invalidos")
        }

        const validarTensao = body.Tensao != ('3') && body.Tensao != ('1,5')
        if (validarTensao) {
            throw ("Dados Invalidos")
        }

        const validarMarca = body.Marca != ('A1,') && body.Marca != ('B3') && body.Marca != ('T10')
        if (validarMarca) {
            throw ("Dados Invalidos")
        }

        const validarTipo = body.Tipo != ('temperatura') && body.Tipo != ('corrente elétrica') && body.Tipo != ('pressão') && body.Tipo != ('intensidade luminosa') && body.Tipo != ('aceleração')
        if (validarTipo) {
            throw ("Dados Invalidos")
        }

        sensorModel.create({
            Nome: body.Nome,
            Tamanho: body.Tamanho,
            Tensao: body.Tensao,
            Marca: body.Marca,
            Tipo: body.Tipo
        })
        return res.status(200).json(body)

    } catch (error) {
        return res.status(400).end(error)
    }
})

routes.delete('/:id', (req, res) => {
    const id = req.params.id


    try {
        let response = sequelize.query(`DELETE FROM dados_sensores WHERE id = ${id}`);
        res.json(response);

    } catch (error) {
        console.log(error);
    }






})






module.exports = routes