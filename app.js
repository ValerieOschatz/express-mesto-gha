const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const { NOT_FOUND } = require('./utils/errorCodes');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '62fa97229bd2fc5be93d353f',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(express.json(), routes);

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  try {
    await app.listen(PORT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}

main();
