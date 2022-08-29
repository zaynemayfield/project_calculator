import pkg from '@prisma/client'
import Helper from '../utilities/helper.mjs'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

class ProjectController {
  async create (req, res) {
    const userId = req.user._id
    const name = req.body.name
    if (name.length < 0) {
      return new Helper(res).sendError('No Name Entered', 'name')
    }
    try {
      const project = await prisma.project.create({ data: { name: name, summary: req.body.summary, user_id: userId, type: req.body.type } })
      return res.send({ project })
    } catch (error) {
      console.log(error)
      // Check DB error to make sure project name is unique and reply
      // return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
      // return new Helper(res).sendError(`You already have a project called: ${name}.`, 'name')
    }
  }

  async list (req, res) {
    const projects = await prisma.project.findMany({ where: { user_id: req.user._id } })
    return res.send({ projects })
  }

  async publicList (req, res) {
    const projects = await prisma.project.findMany({ where: { type: 'Public' }, include: { user: { select: { avatar: true } } }, orderBy: { updatedAt: 'desc' }, take: 3 })
    return res.send({ projects })
  }

  async read (req, res) {
    const userId = req.user._id
    const id = parseInt(req.params.id)
    const project = await prisma.project.findUnique({ where: { id: id }, include: { line_item: { include: { material: true } } } })
    if (!project) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    if (project.user_id !== userId) {
      return new Helper(res).sendError('You do not have permission to access this project', 'user_id')
    }
    return res.send({ project })
  }

  async update (req, res) {

  }

  async delete (req, res) {
    // check for permission to delete
    const id = parseInt(req.params.id)
    const projectId = await prisma.project.findUnique({ where: { id: id } })
    if (!projectId) {
      return new Helper(res).sendError('No project with that ID Exists', 'id')
    }
    try {
      await prisma.project.delete({
        where: { id: projectId.id },
        data: { delete: true }
      })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
    return res.send({ projectId })
  }
}

export default new ProjectController()
