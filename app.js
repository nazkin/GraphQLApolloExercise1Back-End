const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const cors = require('cors');
const PORT = 8080;

mongoose.connect('mongodb://localhost:27017/playlist_gql', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema: schema,
    graphiql: true
}));


// app.get('/', (req, res)=> {
//     res.send('Voila');
// });


app.listen(PORT, ()=> {
    console.log('Server is listening')
})