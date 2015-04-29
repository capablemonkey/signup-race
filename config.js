module.exports = {
  // dwolla sandbox credentials:
  dwolla: {
    client_id: 'eTCy1flPfcjS8K+p1hAkJbCPCyI1T7crvFs+iegs7CwfRz8kZs',
    client_secret: 'pbqq8QfDdQsA6Nf1mhKXkcVnT4vQLC+/YF9vdca6gGBhF8ue7W',
    senderAccessToken: '1VD7BsQDYIGN1uTmcz2tRDTLXlE61DgU3ljvwQTxlpGSXdfwCe',
    senderPIN: 9999
  },
  mongoDB: {
    connectionURL: process.env.MONGOLAB_URI || 'localhost/dwolla-race',
  },
  host: process.env.HOST_URL || 'http://localhost:3000'
};