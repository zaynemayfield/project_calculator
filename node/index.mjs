import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
/*
javascript will do all imports before any other code, so
 even though this line comes before import usercontroller,
 it doesn't actually get run until after. The solution is
 to make a module that calls dotenv.config
 */
import usercontroller from './controllers/usercontroller.mjs'
import projectcontroller from './controllers/projectcontroller.mjs'
import materialcontroller from './controllers/materialcontroller.mjs'
import lineitemcontroller from './controllers/lineitemcontroller.mjs'
import verifytoken from './utilities/verifytoken.mjs'

import busboy from 'express-busboy'

// Creating Express App
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
busboy.extend(app, {
  upload: true,
  allowedPath: url => {
    return [
      '/user/register'
    ].includes(url)
  },
  mimeTypeLimit: [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
})
//Routes that don't require authentication
app.post('/user/register', usercontroller.create.bind(usercontroller))
app.post('/user/login', usercontroller.login.bind(usercontroller))
app.get('/projects/public', projectcontroller.publicList.bind(projectcontroller))

//Middleware for JWT
app.use(verifytoken)


// USER
app.get('/user/:id', usercontroller.read.bind(usercontroller))
app.get('/deleteuser/:id', usercontroller.delete.bind(usercontroller))

// PROJECT
app.post('/project/create', projectcontroller.create.bind(projectcontroller))
app.get('/projects', projectcontroller.list.bind(projectcontroller))
app.get('/project/:id', projectcontroller.read.bind(projectcontroller))
app.post('/project/update/:id', projectcontroller.update.bind(projectcontroller))
app.get('/project/delete/:id', projectcontroller.delete.bind(projectcontroller))

// MATERIAL
app.post('/project/material/create', materialcontroller.create.bind(materialcontroller))
app.get('/project/material/:id', materialcontroller.read.bind(materialcontroller))
app.get('/project/materials/:id', materialcontroller.readAll.bind(materialcontroller))
app.post('/project/material/update/:id', materialcontroller.update.bind(materialcontroller))
app.get('/project/material/delete/:id', materialcontroller.delete.bind(materialcontroller))

//Line Items
app.post('/project/material/lineitem/create', lineitemcontroller.create.bind(lineitemcontroller))
app.get('/project/material/lineitems/both/:id', lineitemcontroller.both.bind(lineitemcontroller))
app.get('/project/material/lineitems/:id', lineitemcontroller.readAll.bind(lineitemcontroller))
app.get('/project/material/lineitem/:id', lineitemcontroller.read.bind(lineitemcontroller))
app.post('/project/material/lineitem/update/', lineitemcontroller.update.bind(lineitemcontroller))
app.get('/project/material/lineitem/duplicate/:id', lineitemcontroller.duplicate.bind(lineitemcontroller))
app.get('/project/material/lineitem/delete/:id', lineitemcontroller.delete.bind(lineitemcontroller))

//All 
app.all('*',(req,res) => {
  res.status(404).send('<h1>Not Found</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})