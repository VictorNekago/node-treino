const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const req = require("express/lib/request")
const res = require("express/lib/response")


const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())




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





let db = [
    { Nome: 'Sensor 1', Tamanho: '3,3,3', Tensao: '3', Marca: 'A1', Tipo: 'temperatura' },
    { Nome: 'Sensor 2', Tamanho: '1,2,2', Tensao: '1,5', Marca: 'B3', Tipo: 'corrente elétrica' },
    { Nome: 'Sensor 3', Tamanho: '3,3,3', Tensao: '1,5', Marca: 'T10', Tipo: 'pressão' }
]

app.get('/', (req, res) => {
    return res.json(db)
})


app.post("/add", (req, res) => {

    try {
        const body = req.body
        const validarSensor = body.Tamanho != ('3,3,3') && body.Tamanho != ('1,2,2')
        if (!body || validarSensor) {
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

app.delete('/:id', (req, res) => {
    const id = req.params.id
    let newDB = db.filter(item => {
        if (!item[id])
            return item
    })

    db = newDB
    return res.send(newDB)
})



app.listen(21262, () => {
    console.log('Express started at http://localhost:21262')
})



