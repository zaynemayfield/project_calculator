import pkg from '@prisma/client'
import Helper from '../utilities/helper.mjs'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

class LineItemController {
  async createBlank (user, project, material) {
    try {
      const blankLineItem = await prisma.line_item.create({ data: { user_id: user, project_id: project, material_id: material } })
      console.log(blankLineItem)
      return blankLineItem
    } catch (error) {
      console.log(error)
    }
  }

  async create (req, res) {
    try {
      const name = req.body.name
      if (name.length < 0) {
        return new Helper(res).sendError('No Name Entered', 'name')
      }
      const userId = req.body.user_id
      const url = req.body.url
      const price = req.body.price
      const description = req.body.description
      const material = await prisma.material.create({ data: { name: name, user_id: userId, url: url, price: price, description: description } })
      delete material.dataValues.userId
      return res.send({ material: material })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async duplicate (req, res) {
    try {
      const id = parseInt(req.params.id)
      const lineItem = await prisma.line_item.findUnique({ where: { id: id } })
      if (!lineItem) {
        return
      }
      const duplicateLineItem = await prisma.line_item.create({ data: { quantity: lineItem.quantity, user_id: lineItem.user_id, notes: lineItem.notes, project_id: lineItem.project_id, material_id: lineItem.material_id } })
      if (!duplicateLineItem) {
        return
      }
      return res.send({ duplicateLineItem: duplicateLineItem })
    } catch (error) {
      console.log(error)
    }
  }

  async read (req, res) {
    const id = parseInt(req.params.id)
    const material = await prisma.material.findUnique({ where: { id: id } })
    if (!material) {
      return new Helper(res).sendError('No material with that ID Exists', 'id')
    }
    delete material.dataValues.user_id
    return res.send({ material: material })
  }

  async both (req, res) {
    const projectId = parseInt(req.params.id)
    const materialLine = await prisma.line_item.findMany({ where: { project_id: projectId }, include: { material: { select: { name: true, url: true, price: true, description: true } } }, orderBy: { updatedAt: 'desc' } })
    if (!materialLine) {
      return new Helper(res).sendError('No material and Line Item with that ID Exists', 'id')
    }
    return res.send({ materialLine: materialLine })
  }

  async readAll (req, res) {
    const projectId = parseInt(req.params.id)
    const lineItems = await prisma.line_item.findMany({ where: { project_id: projectId } })
    if (!lineItems) {
      return new Helper(res).sendError('No line items exist on project', 'id')
    }
    // console.log(lineItems)
    return res.send({ lineItem: lineItems })
  }

  async update (req, res) {
    const id = parseInt(req.body.id)
    const quantity = parseInt(req.body.quantity)
    const updateLineItem = await prisma.line_item.update({
      where: {
        id: id
      },
      data: {
        quantity: quantity,
        notes: req.body.notes
      }
    })
    if (!updateLineItem) {
      return new Helper(res).sendError('Line Item failed to update', 'id')
    }
    return res.send({ updateLineItem: updateLineItem })
  }

  async delete (req, res) {
    const id = parseInt(req.params.id)
    try {
      await prisma.line_item.delete({ where: { id: id } })
      return res.send({ deleteLineItem: id })
    } catch (error) {
      console.log(error)
    }
  }
}

export default new LineItemController()
