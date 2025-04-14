const mongoose = require('mongoose')



const password = process.argv[2]
const arg_name = process.argv[3]
const arg_number = process.argv[4]

const url =
  `mongodb+srv://lean:${password}@course.a7bn8yy.mongodb.net/?retryWrites=true&w=majority&appName=Course`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const note = new Person({
  name: arg_name,
  number: arg_number,
})

if (process.argv.length===3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
} else {
  note.save().then(result => {
  console.log(`added ${result.name} ${result.number} to phonebook`)
  mongoose.connection.close()
})  
}




