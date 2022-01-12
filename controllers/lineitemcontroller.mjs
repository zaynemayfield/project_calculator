import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'

class LineItemController {

async createBlank (user, project, material) {
  try {
    const blankLineItem = await prisma.line_item.create({ data: { user_id: user, project_id: project, material_id: material} })
    console.log('Created blank line item')
    return blankLineItem
  } catch (error) {
    console.log(error)
  }
}

async create (req, res) {
  try {
    const name = req.body.name
    if (name.length < 0){
      return new Helper(res).sendError("No Name Entered", 'name')
    }
    const user_id = req.body.user_id
    const url = req.body.url
    const price = req.body.price
    const description = req.body.description
      const material = await prisma.material.create({ data: { name: name, user_id: user_id, url: url, price: price, description: description } })
      delete material.dataValues.user_id
      return res.send({material: material})
  } catch (error) {
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
  const lineItems = await prisma.line_item.findMany({ where: {project_id: project_id}})
  if (!lineItems) {
    return new Helper(res).sendError('No line items exist on project', 'id')
  }
  console.log(lineItems)
  return res.send({lineItem: lineItems})
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

export default new LineItemController()
