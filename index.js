require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


// Crear un token personalizado para Morgan
// Crear un token personalizado para Morgan
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ''; // Devuelve vacío para otros métodos
});


// Configurar Morgan para usar el token personalizado
app.use(morgan(':method :url :status :response-time ms - :body'));


app.get('/', (request, response) => {
  response.send('<h1>Hello to api Persons!!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  const quantity = 0

  response.send(
    `<p>Phonebook has info for ${quantity} people</p>
    <p>${Date()}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/* const generateId = () => {
  const id = Math.floor(Math.random() * 10000000000000) + 1
  console.log(id)
  return id.toString()
} */

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("body",body)
  //si no existe el nombre en body
  if (body.name===undefined) {
    return response.status(400).json({ 
      error: 'el nombre no puede estar vacio' 
    })
  }

  //si no existe el numero en body
  if (body.number===undefined) {
    return response.status(400).json({ 
      error: 'el numero no puede estar vacio' 
    })
  }
  console.log("body.name",body.name)
  console.log("body.number",body.number)
  //si ya existe el nombre en la agenda
  /* console.log("body.name",body.name)
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'el nombre ya existe en la agenda' 
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log("person",person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

