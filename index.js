const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
//app.use(morgan('tiny'))
morgan.token('post', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

persons = [
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

app.get('/api/persons/', (request, response) => {
    // get full list
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    // single person
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/info', (request, response) => {
    response.send(`<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
    </div>`)
})

app.delete('/api/persons/:id', (request, response) => {
    // delete person
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // error handling
    if (!body.name || !body.number) {
        return response.status(400).json({
        error: 'information missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
        error: 'name must be unique'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000),
    }
  
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})