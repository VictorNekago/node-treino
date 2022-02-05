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


let db = [
    { '1': { Nome: 'Sensor 1', Tamanho: '3,3,3', Tensao: '3', Marca: 'A1', Tipo: 'temperatura' } },
    { '2': { Nome: 'Sensor 2', Tamanho: '1,2,2', Tensao: '1,5', Marca: 'B3', Tipo: 'corrente elétrica' } },
    { '3': { Nome: 'Sensor 3', Tamanho: '3,3,3', Tensao: '1,5', Marca: 'T10', Tipo: 'pressão' } }
]

app.get('/', (req, res) => {
    return res.json(db)
})


app.post("/add", (req, res) => {
    const body = req.body




    if (!body)
        return res.status(400).end()

    db.push(body)
    return res.json(body)
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