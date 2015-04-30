module.exports = {
  // dwolla sandbox credentials:
  dwolla: {
    client_id: process.env.DWOLLA_CLIENT_ID || '',
    client_secret: process.env.DWOLLA_CLIENT_SECRET || '',
    senderAccessToken: process.env.DWOLLA_ACCESS_TOKEN || '',
    senderPIN: process.env.DWOLLA_PIN || ''
  },
  mongoDB: {
    connectionURL: process.env.MONGOLAB_URI || 'localhost/dwolla-race',
  },
  host: process.env.HOST_URL || 'http://localhost:3000'
};