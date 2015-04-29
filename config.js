module.exports = {
  dwolla: {
    client_id: '',
    client_secret: ''
  },
  mongoDB: {
    connectionURL: process.env.MONGOLAB_URI || 'localhost/dwolla-race',
  }
};