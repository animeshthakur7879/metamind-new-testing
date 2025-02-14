// testBcrypt.js

// Import the bcrypt module
const bcrypt = require('bcrypt');

// The plain text password you used during signup (update with your test password)
const plainPassword = '123456'; // Replace with your actual plain password

// The stored hash from your database (copy the hash that is stored in your database)
const storedHash = '$2b$10$8yfu.4nMv/4OTOxKFvFJDuvb7.mpRfwc.Y/N3KuXUBXDDMLhj3NRK';

// Use bcrypt.compare to test if the plain password matches the hash
bcrypt.compare(plainPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error during password comparison:', err);
  } else {
    if (result) {
      console.log('Password match: true');
    } else {
      console.log('Password match: false');
    }
  }
});
