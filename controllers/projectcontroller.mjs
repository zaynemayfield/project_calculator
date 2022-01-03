import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'

class ProjectController {
  async create (req, res) {
    try {
      const name = req.body.name
      if (name.length < 0){
        return new Helper(res).sendError("No Name Entered", 'name')
      }
      const user_id = req.body.user_id
      const project = await prisma.project.create({ data: { name: name, user_id: user_id } })
      delete project.dataValues.user_id
      return res.send({project: project})
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async list (req, res) {
    const id = parseInt(req.params.id)
    const projects = await prisma.project.findMany({ where: {user_id: req.user.id}})
    return res.send({project: projects})
  }

  async read (req, res) {
    const id = parseInt(req.params.id)
    const project = await prisma.project.findUnique({ where: {id: id}})
    if (!project) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    delete project.dataValues.user_id
    return res.send({project: project})
  }

  async delete (req, res) {
    const id = parseInt(req.params.id)
    const projectid = await prisma.project.findUnique({ where: {id: id}})
    if (!projectid) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    try {
      await prisma.project.delete({
        where: { id: projectid.id },
        data: { delete: 'Y' }
      })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
    
    
    return res.send({projectid: projectid})
  }

}

export default new ProjectController()
