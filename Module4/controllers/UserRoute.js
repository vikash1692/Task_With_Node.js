const express = require('express');
const bunyan = require('bunyan');
const { v4: uuidv4 } = require('uuid');
const { validator } = require('../utils');
const User = require('../models/User');
const log = bunyan.createLogger({name: 'myapp'});
const { NotFound, BadRequest } = require('../error');
const { getAllUsers,getUserById, createUser,updateUser, deleteUser,getAutoSuggestUsers } = require('../services/UserServices');
const router = express.Router();

router.get('/', async(req, res) => {
    const users = await getAllUsers();
    log.info('get all user!');
    return res.status(200).json(users)
})

router.get('/getUserById/:id', async(req, res) => {
    try {
        log.info('query params',req.params.id)
        let found =await getUserById(req.params.id)
        if (found) {
            log.info('get user by ID!');
            return res.status(200).json(found);
        } else {
            log.info('user not found!');
            throw new NotFound('user not found');
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
        log.info('create user successfully!');
        // push new item object to data array of items
         await createUser(login,password,age)
        // return with status 201
        // 201 means Created. The request has been fulfilled and 
        // has resulted in one or more new resources being created. 
        const users = await getAllUsers()
        return res.status(201).json(users);
    } else {
        log.info('user is not created!');
        throw new NotFound('user is not created!');
    }
    } catch(e) {
        console.log(e.message)
    }
})


router.get('/getAutoSuggestUsers', async(req, res) => {
    const { login,limit } = req.query;
    log.info('query parmas', login , limit);
    const result = await getAutoSuggestUsers(login);
    if(result){
        log.info('get auto suggest user!');
        res.status(200).json(result.slice(0,limit))
    }else{
        throw new NotFound('Auto suggest user not found!');
    }
   
})
router.put('/updateUser/:id', async(req, res) => {
    const { isValid, message } = validator(req.body)
    const { id} = req.params;
    log.info('query parmas', id);
    const {login,password,age} = req.body;
    log.info('body', login, password, age);
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
                log.info('update user info successfully!');
                return res.status(200).send(updatedUser);
            } else {
                log.info('user not found!');
                throw new NotFound('user not found!')
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
        log.info('user delete in DB successfully!');
        return res.sendStatus(200)
    } else {
        log.info('user not found!');
        throw new NotFound('user not found!')
    }
});

module.exports = router