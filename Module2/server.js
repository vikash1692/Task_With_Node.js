const http = require('http');
const express = require('express');
const user = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use('/user',user)
app.use('/', (req, res) => {
    res.status(200).send('Server Works');
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);

console.debug(`Listen on port ${port}`  );



