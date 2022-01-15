import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'

class ProjectController {

  async create (req, res) {
    try {
      const user_id = req.user._id
      const name = req.body.name
      if (name.length < 0){
        return new Helper(res).sendError("No Name Entered", 'name')
      }
      //check if name is unique
      const check_name = await prisma.project.findMany({where: { name: { equals: name }, user_id: {equals: user_id}} })
      if (check_name.length) {
        return new Helper(res).sendError(`You already have a project called: ${name}.`, 'name')
      }
      
      const project = await prisma.project.create({ data: { name: name, summary: req.body.summary, user_id: user_id, type: req.body.type } })
      return res.send({project: project})
    } catch (error) {
      console.log(error)
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async list (req, res) {
    const projects = await prisma.project.findMany({ where: {user_id: req.user._id}})
    return res.send({projects: projects})
  }

  async publicList (req, res) {
    const projects = await prisma.project.findMany({ where: {type: 'Public'}, include: { user: { select: { avatar: true} } }, orderBy: { updatedAt: 'desc' }, take: 3})
    return res.send({projects: projects})
  }

  async read (req, res) {
    const user_id = req.user._id
    const id = parseInt(req.params.id)
    const project = await prisma.project.findUnique({ where: {id: id}})
    if (!project) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    if (project.user_id != user_id) {
      return new Helper(res).sendError('You do not have permission to access this project', 'user_id')
    }
    return res.send({project: project})
  }

  async update (req, res) {

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