import bcrypt from 'bcrypt'
import crypto from 'crypto'
import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import Helper from '../utilities/helper.mjs'
import validator from 'validator'
import Busboy from 'busboy'
import path from 'path'
import fs from 'fs'

class UserController {
  async create (req, res) {
    try {
      const password = req.body.password
      if (password.length < 8){
        return new Helper(res).sendError("Password is too short", 'password')
      }
      const hash = await bcrypt.hash(req.body.password, 12)
      const email = req.body.email
      if (!validator.isEmail(email)){
        return new Helper(res).sendError(`${email} is not a validate email`, 'email')
      }
      const user = await prisma.user.create({email: email, password: hash})
      delete user.password
      return res.send({user: user})
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
  }

  async read (req, res) {
    const user = await prisma.user.findUnique({ where: { id: req.params.id}})
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
    return res.send({ user: user })
  }

  async delete (req, res) {
    const userid = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!userid) {
      return new Helper(res).sendError('No user with that ID Exists', 'id')
    }
    try {
      await prisma.user.delete({
        where: { id: userid.id }
      })
    } catch (error) {
      return res.status(500).send({ errors: error.errors.map(error => { return { message: error.message, field: error.path } }) })
    }
    
    
    return res.send({userid: userid})
  }

}

export default new UserController()
