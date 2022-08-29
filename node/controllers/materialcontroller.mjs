import pkg from '@prisma/client'
import Helper from '../utilities/helper.mjs'
import lineItemController from './lineItemController.mjs'

const { PrismaClient } = pkg
const prisma = new PrismaClient()

class MaterialController {
  async create (req, res) {
    try {
      const name = req.body.name
      if (name.length < 0) {
        return new Helper(res).sendError('No Name Entered', 'name')
      }
      const userId = req.user._id
      const url = req.body.url
      let price = req.body.price
      if (!req.body.price) {
        price = 0.00
      }
      const description = req.body.description
      const projectId = parseInt(req.body.project_id)
      const material = await prisma.material.create({ data: { name: name, user_id: userId, url: url, price: price, description: description, project_id: projectId } })
      console.log(material)
      const blankLineItem = await lineItemController.createBlank(material.user_id, material.project_id, material.id)
      console.log(blankLineItem)
      if (!blankLineItem) {
        return new Helper(res).sendError('could not create Line Item for Material', 'name')
      }
      blankLineItem.material = material
      return res.send({ line_item: blankLineItem })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async read (req, res) {
    const id = parseInt(req.params.id)
    const material = await prisma.material.findUnique({ where: { id: id } })
    if (!material) {
      return new Helper(res).sendError('No material with that ID Exists', 'id')
    }
    delete material.dataValues.user_id
    console.log(material)
    return res.send({ material })
  }

  async readAll (req, res) {
    const projectId = parseInt(req.params.id)
    const materials = await prisma.material.findMany({ where: { project_id: projectId } })
    if (!materials) {
      return new Helper(res).sendError('No material with that ID Exists', 'id')
    }
    return res.send({ material: materials })
  }

  async update (req, res) {
    const materialId = parseInt(req.params.id)
    const updateMaterial = await prisma.material.update({
      where: {
        id: materialId
      },
      data: {
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        price: req.body.price
      }
    })
    if (!updateMaterial) {
      return new Helper(res).sendError('Material failed to update', 'id')
    }
    return res.send({ material: updateMaterial })
  }

  async delete (req, res) {
    // check for permission to delete
    const id = parseInt(req.params.id)
    const deleted = await prisma.material.delete({ where: { id: id } })
    return res.send({ material: deleted })
  }
}

export default new MaterialController()
