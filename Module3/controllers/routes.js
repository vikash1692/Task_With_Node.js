const express = require('express');
const { v4: uuidv4 } = require('uuid');
const validator = require('../utils');
const User = require('../models/User');
const { getAllUsers,getUserById, createUser,updateUser, deleteUser,getAutoSuggestUsers } = require('../services/UserService');

// create a JSON data array
let userData = [
    { id: uuidv4(), login: 'Work', password: 'abc', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Eat', password: 'def', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Read', password: 'ghi', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Sleep', password: 'jkl', isDeleted: false, age: 27 },
    { id: uuidv4(), login: 'Rest', password: 'mno', isDeleted: false, age: 27 },
];

const router = express.Router();

router.get('/', async(req, res) => {
    const users = await getAllUsers();
   await  res.status(200).json(users)
})

router.get('/getUserById/:id', async(req, res) => {
    try {
    let found =await getUserById(req.params.id)
    if (found) {
       await res.status(200).json(found);
    } else {
       await res.status(200).sendStatus(404)
    }
} catch(e) {
    console.log(e.message)
}       
})

router.post('/createUser', async(req, res) => {
    try{
    const { isValid, message } = validator(req.body)
    const {login,password,age} = req.body;
    if (isValid) {
        // push new item object to data array of items
         await createUser(login,password,age)
        // return with status 201
        // 201 means Created. The request has been fulfilled and 
        // has resulted in one or more new resources being created. 
        const users = await getAllUsers()
        await res.status(201).json(users);
    } else {
        res.status(400).json(message)
    }
    } catch(e) {
        console.log(e.message)
    }
})


router.get('/getAutoSuggestUsers', async(req, res) => {
    const { login,limit } = req.query;
    const result = await getAutoSuggestUsers(login)
    res.status(200).json(result.slice(0,limit))
   
})
router.put('/updateUser/:id', async(req, res) => {
    const { isValid, message } = validator(req.body)
    const { id} = req.params;
    const {login,password,age} = req.body;
    try {
    if (isValid) {
        let found = await getUserById(id)
        // check if item found
        if (found) {
            await updateUser(login,password,age,+id)
            // return with status 204
            // success status response code 204 indicates
            // that the request has succeeded
            const updatedUser = await getUserById(id)
            await res.status(200).send(updatedUser);
        } else {
            await res.sendStatus(404);
        }
    } else {
        res.status(400).json(message)
    }
}catch(e) {
    console.log(e.message)
}
})

router.delete('/deleteUser/:id',async (req, res) => {
    const { id} = req.params;
    // find item from array of data
    let found =  await getUserById(id)
    if (found !== null) {
        await deleteUser(id)
        await res.sendStatus(200)
    } else {
        await res.sendStatus(404)
    }
});

module.exports = router