const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const handleErrors = require('./middleware');


const user = require('./controllers/UserRoute');
const group = require('./controllers/GroupRoute')

const app = express();



// parse application/json

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(handleErrors)
app.use('/user',user)
app.use('/group',group)
// default URL to API
app.use('/', (req, res) => {
    res.status(200).send('Server Works');
});

const server = http.createServer(app);
const port = process.env.SERVER_PORT || 3004;
server.listen(port);

console.log('Port',process.env.SERVER_PORT)

console.debug(`Server listening on port ${port}`);



