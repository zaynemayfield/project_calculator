import db from '../models/index.js'
import Helper from '../utilities/helper.mjs'

class ProjectController {
  async create (req, res) {
    try {
      const name = req.body.name
      if (name.length < 0){
        return new Helper(res).sendError("No Name Entered", 'name')
      }
      const user_id = req.body.user_id
      const project = await db.project.create({name: name, user_id: user_id})
      delete project.dataValues.user_id
      return res.send({project: project})
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async read (req, res) {
    const project = await db.project.findByPk(req.params.id)
    if (!project) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    delete project.dataValues.user_id
    return res.send({project: project})
  }

async createMaterial (req, res) {
  try {
    const name = req.body.name
    if (name.length < 0){
      return new Helper(res).sendError("No Name Entered", 'name')
    }
    const user_id = req.body.user_id
    const url = req.body.url
    const price = req.body.price
    const description = req.body.description
      const material = await db.material.create({name: name, user_id: user_id, url: url, price: price, description: description})
      delete material.dataValues.user_id
      return res.send({material: material})
  } catch (error) {
    return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
  }
}

async readMaterial (req, res) {
  const material = await db.material.findByPk(req.params.id)
  if (!material) {
    return new Helper(res).sendError('No material with that ID Exists', 'id')
  }
  delete material.dataValues.user_id
  return res.send({material: material})
}

}

export default new ProjectController()
