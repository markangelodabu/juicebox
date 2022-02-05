const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 3, username: 'joshua' }, 'server secret', { expiresIn: '1w' });
console.log(token);
token; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impvc2h1YSIsImlhdCI6MTU4ODAyNDQwNn0.sKuQjJRrTjmr0RiDqEPJQcTliB9oMACbJmoymkjph3Q'

const recoveredData = jwt.verify(token, 'server secret');

recoveredData; // { id: 3, username: 'joshua', iat: 1588024406 }
console.log(recoveredData);
// wait 1 hour:

console.log(token);
jwt.verify(token, 'server secret');

// Uncaught TokenExpiredError: jwt expired {
//   name: 'TokenExpiredError',
//   message: 'jwt expired',
//   expiredAt: 2020-04-27T21:58:57.000Z
// }