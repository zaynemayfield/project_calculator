import express from 'express'
import { Sequelize } from 'sequelize'
import usercontroller from './controllers/usercontroller.mjs';

const app = express()
const port = 3000
app.use(express.json())

const sequelize = new Sequelize('project_calculator', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb'
})


try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.get('/', (req, res) => {
  res.send({ greeting: 'Hello World!' })
})

app.post('/user', usercontroller.create)

app.get('/user/:id', usercontroller.read)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
