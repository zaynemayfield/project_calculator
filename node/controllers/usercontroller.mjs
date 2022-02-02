import bcrypt from 'bcrypt'
import crypto from 'crypto'
import pkg from '@prisma/client'
import Helper from '../utilities/helper.mjs'
import { mkdir } from 'fs/promises'
import sharp from 'sharp'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

class UserController {
  validateUser (user) {
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).min(4).required(),
      password: Joi.string().min(3).required()
    })
    return schema.validate(user)
  }

  generateToken () {
    const token = crypto.randomBytes(16).toString('hex')
    return token
  }

  updateToken (userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { token: this.generateToken() }
    })
  }

  async create (req, res) {
    // Validate using Joi
    const response = this.validateUser(req.body)
    if (response.error) {
      return new Helper(res).sendError(response.error.details[0].message, response.error.details[0].path)
    }
    // check if email is unique
    const checkEmail = await prisma.user.findUnique({ where: { email: req.body.email } })
    if (checkEmail) {
      return new Helper(res).sendError(`${req.body.email} is already registered`, 'email')
    }
    // Hash Password
    const hash = await bcrypt.hash(req.body.password, 12)

    // check to see if account has been deleted

    // create user
    const user = await prisma.user.create({ data: { email: req.body.email, password: hash, token: this.generateToken() } })
    // remove password from object
    delete user.password
    // check if user uploaded an avatar
    const avatar = req.files?.avatar
    if (avatar) {
      // handle creating path, moving, resizing, etc.
      const path = `./resources/user/${user.id}`
      await mkdir(path, { recursive: true })
      await sharp(avatar.file)
        .resize(240)
        .toFile(`${path}/avatar.png`, function (err) {
          if (!err) {
            console.log('Modified and moved image')
          }
        })
      // update db for the avatar url
      const urlAvatar = `${path}/avatar.png`
      user.avatar = urlAvatar.slice(1)

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          avatar: user.avatar
        }
      })
    } else {
      console.log('no avatar present')
    }

    return res.send({ user: user })
  }

  async read (req, res) {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ where: { id: id } })
    if (!user) {
      return new Helper(res).sendError('No user with that ID Exists', 'id')
    }
    delete user.password
    return res.send({ user: user })
  }

  async login (req, res) {
    // Validate with Joi
    const response = this.validateUser(req.body)
    if (response.error) {
      return new Helper(res).sendError(response.error.details[0].message, response.error.details[0].path)
    }

    // Find user in database
    const user = await prisma.user.findUnique({ where: { email: req.body.email } })
    if (!user) {
      return new Helper(res).sendError('Unknown User Email Address', 'email')
    }

    // check if account has been deleted
    if (user.deleted) {
      return new Helper(res).sendError('Account was deleted', 'Account')
    }

    // check if passwords match
    const passwordCorrect = await bcrypt.compare(req.body.password, user.password)
    if (!passwordCorrect) {
      return new Helper(res).sendError('Password incorrect', 'password')
    }

    // remove password
    delete user.password

    // create JWT Token
    const accessToken = jwt.sign({ _id: user.id, type: user.type }, process.env.SECRET_TOKEN, { expiresIn: '7d' })
    console.log('logged in!')
    return res.send({ accessToken })
  }

  async delete (req, res) {
    // check for permission to delete
    const id = parseInt(req.params.id)
    const userId = await prisma.user.findUnique({ where: { id: id } })
    if (!userId) {
      return new Helper(res).sendError('No user with that ID Exists', 'id')
    }
    try {
      await prisma.user.update({
        where: { id: userId.id },
        data: { deleted: true }
      })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }

    return res.send({ userId: userId })
  }
}

export default new UserController()
