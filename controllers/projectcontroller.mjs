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


}

export default new ProjectController()
