export default class Helper {
  constructor (res) {
    this.res = res
  }

  sendError (message, field) {
    return this.res.status(500).send({
      errors: [
        {
          message: message,
          field: field
        }
      ]
    })
  }
  deleted (status,type) {
    console.log(status, type)
    if (status === 'Y') {
      return this.res.send('${type} has been deleted')
    }
  } 
  
}