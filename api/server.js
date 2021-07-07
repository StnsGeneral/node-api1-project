// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();

server.use(express.json());

const Users = require('./users/model');

// Checking that the server is live and sending data.
// server.get('/', (req, res) => {
//   res.send('Welcome to the users API');
// });

// Creates a user using the information sent inside the 'request body'
server.post('/api/users', async (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ message: 'Please provide name and bio for the user' });
  } else {
    Users.insert(newUser)
      .then((newlyCreatedUser) => res.status(201).json(newlyCreatedUser))
      .catch((error) => {
        res.status(500).json({
          message: 'There was an error while saving the user to the database',
        });
      });
  }
});

// Returns an array of the users.
server.get('/api/users', async (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'The users information could not be retrieved' });
    });
});

// Returns the user object with the specified `id`.
server.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then((user) => {
      user
        ? res.status(200).json(user)
        : res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist' });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: 'The user information could not be retrieved' });
    });
});

// Removes the user with the specified `id` and returns the deleted user.
server.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'The user could not be removed' });
    });
});

// Updates the user with the specified `id` use data from the `request body`. Returns the modified user.
server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ message: 'Please provide name and bio for the user' });
  } else {
    Users.update(id, { name, bio })
      .then((updatedUser) => {
        if (!updatedUser) {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist' });
        } else {
          res.status(200).json(updatedUser);
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: 'The user information could not be modified' });
      });
  }
});

// Exporting the server
module.exports = server;
