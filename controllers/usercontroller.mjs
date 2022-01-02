import bcrypt from 'bcrypt'
import crypto from 'crypto'
import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'
import Busboy from 'busboy'
import { mkdir } from 'fs/promises'
import sharp from 'sharp'
import jwt from 'jsonwebtoken'
import Joi from 'joi'


class UserController {
  validateUser(user) {
    const schema = Joi.object({
      email: Joi.string().email({minDomainSegments: 2,}).min(4).required(),
      password: Joi.string().min(3).required(),
    })
    return schema.validate(user)
  }

  generate_token () {
    const token = crypto.randomBytes(16).toString('hex')
    return token
  }
  update_token (user_id) {
    return prisma.user.update({
      where: {id: user_id},
      data: { token: this.generate_token()}
    })
  }
  async create (req, res) {
    try {
      const response = this.validateUser(req.body)
      if (response.error) {
        return res.status(400).send(response.error.details)
      }
      else {
        //Hash Pasword
        const hash = await bcrypt.hash(req.body.password, 12)
        //check if email is unique
        const check_email = await prisma.user.findUnique({where: { email: req.body.email } })
        if (check_email) {
          return new Helper(res).sendError('${email} is not available', 'email')
        }
      //create user
      const user = await prisma.user.create({ data: { email: req.body.email, password: hash, token: this.generate_token() } })
      //remove password from object
      delete user.password
      //check if user uploaded an avatar
      const avatar = req.files?.avatar
      if (avatar) {
        //handle creating path, moving, resizing, etc.
        const path = `./resources/user/${user.id}`
        await mkdir( path, { recursive: true } )
        await sharp(avatar.file)
        .resize(240)
        .toFile(`${path}/avatar.png`, function(err) {
          if (!err) {
            console.log('Modified and moved image')
          }
        })
        //update db for the avatar url
        user.avatar = `${path}/avatar.png`
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            avatar: user.avatar,
          }
        })
      }
      else {
        console.log('no avatar present')
      }
      
      return res.send({user: user})
    }
    } catch (error) {
      console.error(error)
      // return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async read (req, res) {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ where: { id: id}})
    if (!user) {
      return new Helper(res).sendError('No user with that ID Exists', 'id')
    }
    delete user.password
    return res.send({user: user})
  }

  async login (req, res) {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } })
    if (!user) {
      return new Helper(res).sendError('Unknown User Email Address', 'email')
    }
    const passwordCorrect = await bcrypt.compare(req.body.password, user.password)
    if (!passwordCorrect){
      return new Helper(res).sendError('Password incorrect', 'password')
    }
    delete user.password
    const accessToken = jwt.sign(user, process.env.SECRET_TOKEN)
    return res.send({ accessToken })
  }

  async delete (req, res) {
    const id = parseInt(req.params.id)
    const userid = await prisma.user.findUnique({ where: { id: id } })
    if (!userid) {
      return new Helper(res).sendError('No user with that ID Exists', 'id')
    }
    try {
      await prisma.user.delete({
        where: { id: userid.id },
        data: { delete: 'Y'}
      })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
    
    
    return res.send({userid: userid})
  }

}

export default new UserController()
