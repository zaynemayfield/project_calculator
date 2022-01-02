import express from 'express'
import cors from 'cors'
/*
javascript will do all imports before any other code, so
 even though this line comes before import usercontroller,
 it doesn't actually get run until after. The solution is
 to make a module that calls dotenv.config
 */
import usercontroller from './controllers/usercontroller.mjs'
import projectcontroller from './controllers/projectcontroller.mjs'
import materialcontroller from './controllers/materialcontroller.mjs'

import busboy from 'express-busboy'

// Creating Express App
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
busboy.extend(app, {
  upload: true,
  allowedPath: url => {
    return [
      '/user_register'
    ].includes(url)
  },
  mimeTypeLimit: [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
})

// USER
app.post('/user/register', usercontroller.create.bind(usercontroller))
app.post('/user/login', usercontroller.login.bind(usercontroller))
app.get('/user/:id', usercontroller.read.bind(usercontroller))
app.get('/deleteuser/:id', usercontroller.delete.bind(usercontroller))

// PROJECT
app.post('/createproject', projectcontroller.create.bind(projectcontroller))
app.get('/project/:id', projectcontroller.read.bind(projectcontroller))
app.get('/deleteproject/:id', projectcontroller.delete.bind(projectcontroller))

// MATERIAL
app.post('/creatematerial', materialcontroller.create.bind(materialcontroller))
app.get('/material/:id', materialcontroller.read.bind(materialcontroller))
app.get('/deletematerial/:id', materialcontroller.delete.bind(materialcontroller))

//All
app.all('*',(req,res) => {
  res.status(404).send('<h1>Not Found</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
