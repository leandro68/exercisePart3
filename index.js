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
  Person
    .findById(request.params.id).then(person => {
      response.json(person)
    })
    .catch(error => next(error))  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/* const generateId = () => {
  const id = Math.floor(Math.random() * 10000000000000) + 1
  console.log(id)
  return id.toString()
} */

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  //console.log("body",body)
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

  //console.log("person",person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

