require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(express.static('dist'))
app.use(express.json())
//app.use(cors())
//app.use(morgan('tiny'))
morgan.token('post', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)

app.get('/api/persons/', (request, response) => {
    // get full list
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    // single person
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
      }).catch(error => next(error))
})

app.get('/api/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        //console.log(count)
        response.send(`<div>
        <p>Phonebook has info for ${count} people</p>
        <p>${Date()}</p>
        </div>`)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    // delete person
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // error handling

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
        error: 'information missing'
        })
    }
    
    const person = new Person ({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})