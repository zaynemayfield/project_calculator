import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'
import lineitemcontroller from './lineitemcontroller.mjs'

class MaterialController {
  
async create (req, res) {
  try {
    const name = req.body.name
    if (name.length < 0){
      return new Helper(res).sendError("No Name Entered", 'name')
    }
    const user_id = req.user._id
    const url = req.body.url
    const price = req.body.price
    const description = req.body.description
    const project_id = parseInt(req.body.project_id)
      const material = await prisma.material.create({ data: { name: name, user_id: user_id, url: url, price: price, description: description, project_id: project_id } })
      const blankLineItem = await lineitemcontroller.createBlank(material.user_id, material.project_id, material.id)
      return res.send({material: material})
  } catch (error) {
    console.log(error)
    return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
  }
}

async read (req, res) {
  const id = parseInt(req.params.id)
  const material = await prisma.material.findUnique({ where: {id: id}})
  if (!material) {
    return new Helper(res).sendError('No material with that ID Exists', 'id')
  }
  delete material.dataValues.user_id
  return res.send({material: material})
}

async readAll (req, res) {
  const project_id = parseInt(req.params.id)
  const materials = await prisma.material.findMany({ where: {project_id: project_id}})
  if (!materials) {
    return new Helper(res).sendError('No material with that ID Exists', 'id')
  }
  return res.send({material: materials})
}

async update (req, res) {

}

async delete (req, res) {
  const id = parseInt(req.params.id)
  const materialid = await prisma.material.findUnique({ where: {id: id}})
  if (!materialid) {
    return new Helper(res).sendError('No material with that ID Exists', 'id')
  }
  try {
    await prisma.material.delete({
      where: { id: materialid.id },
      data: { delete: 'Y'}
    })
  } catch (error) {
    return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
  }
  
  
  return res.send({materialid: materialid})
}

}

export default new MaterialController()
