import express from 'express'
import cors from 'cors'
/*
javascript will do all imports before any other code, so
 even though this line comes before import userController,
 it doesn't actually get run until after. The solution is
 to make a module that calls dotenv.config
 */
import userController from './controllers/userController.mjs'
import projectController from './controllers/projectController.mjs'
import materialController from './controllers/materialController.mjs'
import lineItemController from './controllers/lineItemController.mjs'
import verifyToken from './utilities/verifyToken.mjs'

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
// Routes that don't require authentication
app.post('/user/register', userController.create.bind(userController))
app.post('/user/login', userController.login.bind(userController))
app.get('/projects/public', projectController.publicList.bind(projectController))

// Middleware for JWT
app.use(verifyToken)

// USER
app.get('/user/:id', userController.read.bind(userController))
app.get('/user/delete/:id', userController.delete.bind(userController))

// PROJECT
app.post('/project/create', projectController.create.bind(projectController))
app.get('/projects', projectController.list.bind(projectController))
app.get('/project/:id', projectController.read.bind(projectController))
app.post('/project/update/:id', projectController.update.bind(projectController))
app.get('/project/delete/:id', projectController.delete.bind(projectController))

// MATERIAL
app.post('/project/material/create', materialController.create.bind(materialController))
app.get('/project/material/:id', materialController.read.bind(materialController))
app.get('/project/materials/:id', materialController.readAll.bind(materialController))
app.post('/project/material/update/:id', materialController.update.bind(materialController))
app.get('/project/material/delete/:id', materialController.delete.bind(materialController))

// Line Items
app.post('/project/material/line-item/create', lineItemController.create.bind(lineItemController))
app.get('/project/material/line-items/both/:id', lineItemController.both.bind(lineItemController))
app.get('/project/material/line-items/:id', lineItemController.readAll.bind(lineItemController))
app.get('/project/material/line-item/:id', lineItemController.read.bind(lineItemController))
app.post('/project/material/line-item/update/', lineItemController.update.bind(lineItemController))
app.get('/project/material/line-item/duplicate/:id', lineItemController.duplicate.bind(lineItemController))
app.get('/project/material/line-item/delete/:id', lineItemController.delete.bind(lineItemController))

// All
app.all('*', (req, res) => {
  res.status(404).send('<h1>Not Found</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
