const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

module.exports = ({ email, firstName, lastName, user_id }) => {
  return new Promise((resolve, reject) => {
    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "no_reply@egolord.com",
              "Name": "The Chat People"
            },
            "To": [
              {
                "Email": email,
                "Name": `${firstName} ${lastName}`
              }
            ],
            "TemplateID": 333552,
            "TemplateLanguage": true,
            "Subject": "Welcome to the Chat App! Verify your email address",
            "Variables": {
              "name": firstName,
              "url": 'https://localhost:3000/verify/' + user_id
            }
          }
        ]
      })
    return request
      .then((result) => {
        resolve(email)
      })
      .catch((err) => {
        reject({ error: err, type: 'email' })
      })
  })
}