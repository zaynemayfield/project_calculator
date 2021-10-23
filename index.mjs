import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
// import { Sequelize } from 'sequelize'
import usercontroller from './controllers/usercontroller.mjs'

// Creating Express App
const app = express()
const port = 3000
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

app.post('/user', usercontroller.create)

app.get('/user/:id', usercontroller.read)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
