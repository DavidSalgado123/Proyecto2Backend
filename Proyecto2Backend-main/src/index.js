import mongoose from 'mongoose';
import app from './app.js'
// Conexión a MongoDB usando mongoose
mongoose
  .connect(
    'mongodb+srv://' +
      process.env.MONGO_USER +
      ':' +
      process.env.MONGO_PASS +
      '@proyecto1backend.j7jmslp.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected.');
  })
  .catch((err) => {
    console.log('There was an error with connection!');
    console.log(err);
  });


// Inicia app en puerto 8080
app.listen(8080);
