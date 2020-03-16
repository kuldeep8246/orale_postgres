
const crypto = require('crypto');

    const hash = crypto.createHash('sha256');
    hash.update('secret');
    console.log(hash.digest('hex'));
