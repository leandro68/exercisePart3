const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const quantity = 0

  response.send(
    `<p>Phonebook has info for ${quantity} people</p>
    <p>${Date()}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 10000000000000) + 1
  console.log(id)
  return id.toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  //si no existe el nombre en body
  if (!body.name) {
    return response.status(400).json({ 
      error: 'el nombre no puede estar vacio' 
    })
  }

  //si no existe el numero en body
  if (!body.number) {
    return response.status(400).json({ 
      error: 'el numero no puede estar vacio' 
    })
  }

  //si ya existe el nombre en la agenda
  console.log("body.name",body.name)
  console.log("persons",persons)
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'el nombre ya existe en la agenda' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

