import express from 'express'
import dotenv from 'dotenv'
/*
javascript will do all imports before any other code, so
 even though this line comes before import usercontroller,
 it doesn't actually get run until after. The solution is
 to make a module that calls dotenv.config
 */
import config from './config/index.mjs'

// import { Sequelize } from 'sequelize'
import usercontroller from './controllers/usercontroller.mjs'
import projectcontroller from './controllers/projectcontroller.mjs'
import materialcontroller from './controllers/materialcontroller.mjs'

// Creating Express App
const app = express()
app.use(express.json())

// Making Database Connection (Sequelize CLI)
// When installing use node_modules/.bin/sequelize init
/*const sequelize = new Sequelize('project_calculator', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb'
})

try {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}
*/
app.get('/', (req, res) => {
  res.send({ greeting: 'Hello World!' })
})
// USER
app.post('/user', usercontroller.create)
app.post('/user/login', usercontroller.login)
app.get('/user/:id', usercontroller.read)
// PROJECT
app.post('/createproject', projectcontroller.create)
app.get('/project/:id', projectcontroller.read)
// MATERIAL
app.post('/creatematerial', materialcontroller.create)
app.get('/material/:id', materialcontroller.read)

const port = parseInt(process.env.SERVER_PORT, 10)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
