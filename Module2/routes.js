const express = require('express');
const { v4: uuidv4 } = require('uuid');
const validator = require('./utils');

let userData = [
    { id: uuidv4(), login: 'Work', password: 'abc', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Eat', password: 'def', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Read', password: 'ghi', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Sleep', password: 'jkl', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Rest', password: 'mno', isDeleted: false, age: 27 },
];

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(userData)
})

router.get('/getUserById/:id', (req, res) => {
    let found = userData.find(item => (
        item.id === req.params.id
    ));
    if (found) {
        res.status(200).json(found);
    } else {
        res.status(200).sendStatus(404)
    }
})

router.post('/createUser', (req, res) => {

    const { isValid, message } = validator(req.body)
    let newItem = {
        id: uuidv4(),
        login: req.body.login,
        password: req.body.password,
        isDeleted: false,
        age: req.body.age
    };
    if (isValid) {
        userData.push(newItem);
        res.status(201).json(userData);
    } else {
        res.status(400).json(message)
    }
})


router.get('/getAutoSuggestUsers', (req, res) => {
    const { login,limit } = req.query;
    const result = userData.sort((a,b)=>(a.login > b.login) ? 1 : ((b.login > a.login) ? -1 : 0)).filter(user => user.login.replace(/ /g,'').toLowerCase() === login.replace(/ /g,'').toLowerCase());
    res.status(200).json(result.slice(0,limit))
   
})
router.put('/updateUser/:id', (req, res) => {
    const { isValid, message } = validator(req.body)
    if (isValid) {
        let found = userData.find(item => (
            item.id === req.params.id
        ));
        if (found) {
            let updated = {
                id: found.id,
                login: req.body.login,
                password: req.body.password,
                age: req.body.age,
                isDeleted: false
            };

            let targetIndex = userData.indexOf(found);
            userData.splice(targetIndex, 1, updated);

            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.status(400).json(message)
    }
})

router.delete('/deleteUser/:id', (req, res) => {
    let found = userData.find(item => (
        item.id === req.params.id
    ));

    if (found) { 
        let targetIndex = userData.indexOf(found);
        found['isDeleted'] = true;
        userData[targetIndex] = { ...found };
    } 
    res.status(200).json(userData);
});

module.exports = router