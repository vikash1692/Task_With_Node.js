const express = require('express');
const bunyan = require('bunyan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { validator } = require('../utils');
const User = require('../models/User');
const log = bunyan.createLogger({name: 'myapp'});
const AppError = require('../error');
const config = require('../config');
const { getAllUsers,getUserById, createUser,updateUser, deleteUser,getAutoSuggestUsers } = require('../services/UserServices');
const router = express.Router();

router.get('/', async(req, res) => {
    let token = req.headers['x-access-token'];
    if (!token){
        throw new AppError('No token provided', 401)
    } 
    let tokenVerify = jwt.verify(token, config.secret);
    if (tokenVerify){
        const users = await getAllUsers();
        log.info('get all user!');
        return res.status(200).json(users)
    } else {
        throw new AppError('Failed to authenticate token.', 401)
    }
})

router.get('/getUserById/:id', async(req, res) => {
    try {
        let token = req.headers['x-access-token'];
        if (!token){
            throw new AppError('No token provided', 401)
        } 
        log.info('query params',req.params.id)
        let tokenVerify = jwt.verify(token, config.secret);
        if (tokenVerify) {
            let found =await getUserById(req.params.id)
            if (found) {
                log.info('get user by ID!');
                return res.status(200).json(found);
            } else {
                log.info('user not found!');
                throw new AppError('User not found!', 404)
            }
        }else {
            throw new AppError('Failed to authenticate token.', 401)
        }
    } catch(e) {
        log.info(e.message);
        throw new AppError(e.message, 502)
    }       
})

router.post('/createUser', async(req, res) => {
    try{
    const { isValid, message } = validator(req.body)
    const {login,password,age} = req.body;
    if (isValid) {
        let hashedPassword = bcrypt.hashSync(password, 8);
        log.info('create user successfully!');
        // push new item object to data array of items
         let user = await createUser(login,hashedPassword,age)
        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        // return with status 201
        // 201 means Created. The request has been fulfilled and 
        // has resulted in one or more new resources being created. 
        const users = await getAllUsers()
        return res.status(201).json({userDetail :users, token: token});
    } else {
        log.info('user is not created!');
        throw new AppError('user is not created!', 402)
    }
    } catch(e) {
        log.info('e.message')
        throw new AppError(e.message, 502)
    }
})


router.get('/getAutoSuggestUsers', async(req, res) => {
    let token = req.headers['x-access-token'];
    if (!token){
        throw new AppError('No token provided', 401)
    } 
    const { login,limit } = req.query;
    log.info('query parmas', login , limit);
    let tokenVerify = jwt.verify(token, config.secret);
    if (tokenVerify) {
        const result = await getAutoSuggestUsers(login);
        if(result){
            log.info('get auto suggest user!');
            res.status(200).json(result.slice(0,limit))
        }else{
            throw new AppError('Auto suggest user not found!', 402)
        }
    }else {
        throw new AppError('Failed to authenticate token.', 401)
    }
   
})
router.put('/updateUser/:id', async(req, res) => {
    let token = req.headers['x-access-token'];
    if (!token){
        throw new AppError('No token provided', 401)
    }
    const { isValid, message } = validator(req.body)
    const { id} = req.params;
    log.info('query parmas', id);
    const {login,password,age} = req.body;
    log.info('body', login, password, age);
    try {
        let tokenVerify = jwt.verify(token, config.secret); 
        if(tokenVerify){
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
                    throw new AppError('user not found!', 404)
                }
            } else {
            throw new AppError(message, 400)
            } 
        }else {
            throw new AppError('Failed to authenticate token.', 401)
        }
    }catch(e) {
        throw new AppError(e.message, 502)
    }
})

router.delete('/deleteUser/:id',async (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token){
        throw new AppError('No token provided', 401)
    }
    const { id} = req.params;
    // find item from array of data
    let tokenVerify = jwt.verify(token, config.secret); 
    if(tokenVerify){
        let found =  await getUserById(id)
        if (found !== null) {
            await deleteUser(id)
            log.info('user delete in DB successfully!');
            return res.sendStatus(200)
        } else {
            log.info('user not found!');
            throw new AppError('user not found!', 404)
        }
    }else {
        throw new AppError('Failed to authenticate token.', 401)
    }
});

module.exports = router