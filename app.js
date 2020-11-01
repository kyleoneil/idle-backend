require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});

const userRouter = require('./api/users/user.router');

app.use(express.json());
app.use(urlEncodedParser);
app.use(bodyParser.json());

app.use('/api/users', userRouter);

app.listen(process.env.APP_PORT, (req, res) => {
    console.log("Listening to Port : " + process.env.APP_PORT);
});