const http = require('http');
const express = require('express');
const dotenv = require('dotenv')
dotenv.config();



const user = require('./controllers/routes');

const app = express();



// parse application/json

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use('/user',user)

// default URL to API
app.use('/', (req, res) => {
    res.status(200).send('Server Works');
});

const server = http.createServer(app);
const port = process.env.SERVER_PORT || 3001;
server.listen(port);

console.log('Port',process.env.SERVER_PORT)

console.debug(`Server listening on port ${port}`);



