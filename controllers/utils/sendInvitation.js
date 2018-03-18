const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

module.exports = (site_id, siteName, email, firstName, siteToUpdate) => {
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
                "Name": firstName
              }
            ],
            "TemplateID": 332153,
            "TemplateLanguage": true,
            "Subject": "You've been added to a site!",
            "Variables": {
              "Site-Name": siteName,
              "url": 'https://localhost:8080/signup/' + site_id
            }
          }
        ]
      })
    request
      .then((result) => {
        resolve(siteToUpdate)
      })
      .catch((err) => {
        reject(err)
      })
  })
}