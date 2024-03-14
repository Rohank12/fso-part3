const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://rohankelley:${password}@cluster0.an5v5ow.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const argv = process.argv

if (argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else if (argv.length === 5) {
    const person = new Person({
        name: argv[3],
        number: argv[4],
    })
    person.save().then(result => {
        console.log('added', result.name, result.number, 'to phonebook')
        mongoose.connection.close()
    })
}
