
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fs = require('fs')

app.use(express.json())
app.use(express.static(__dirname + '/public')) 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/index.html'))
})
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/notes.html'))
})
app.get('/api/notes', (req, res) =>{
  fs.readFile(path.join(__dirname,'./db/db.json'), (err, data)=>{
    if (err){
      console.log(err)
      res.status(404).send('Oops, something went wrong!')
    }
    else{
      res.status(200).send(data)
    }
  })
})
  app.post('/api/notes', (req, res) =>{
    fs.readFile(path.join(__dirname,'./db/db.json'), (err, data)=>{
      if (err){
        console.log(err)
        
      }
      else{
        const updatedNotes = JSON.parse(data)
        updatedNotes.push(req.body) 
        for (let i = 0; i < updatedNotes.length; i++){
          const note = updatedNotes[i]
          note.id = i+1
        }
        fs.writeFile(path.join(__dirname,'./db/db.json'), JSON.stringify(updatedNotes), (err)=>{
          if (err){
            console.log(err)
            res.status(404).send('Oops, something went wrong!')
          }
          else{
            res.status(201).send(req.body)
          }

        })
      }
    })

})

app.delete('/api/notes/:id', (req,res)=>{
  console.log(req.params.id)
  fs.readFile(path.join(__dirname,'./db/db.json'), (err, data)=>{
    if (err){
      console.log(err)
      
    }
    else{
      const notes = JSON.parse(data)
      const updatedNotes = notes.filter((note)=>{ // filters through the notes array and creates a new array w/ items which is true
        return note.id != req.params.id //returns boolean (true or false in each array)

      })
      
      fs.writeFile(path.join(__dirname,'./db/db.json'), JSON.stringify(updatedNotes), (err)=>{
        if (err){
          console.log(err)
          res.status(404).send('Oops, something went wrong!')
        }
        else{
          res.status(201).send('Note deleted!')
        }

      })
    }
  })
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
