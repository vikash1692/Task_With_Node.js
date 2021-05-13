  
const express = require('express');
const bunyan = require('bunyan');
const { permissionValidator } = require('../utils');
const { NotFound, BadRequest } = require('../error');
const log = bunyan.createLogger({name: 'myapp'});
const { getAllGroups,getGroupById, createGroup, updateGroup, deleteGroup, addUsersToGroup } = require('../services/GroupServices');

const router = express.Router();

router.get('/', async(req, res) => {
    const groups = await getAllGroups();
    log.info('get all group!');
    return  res.status(200).json(groups)
})

router.get('/:id',async(req,res)=>{
    const { id } = req.params;
    log.info('query params', id);
    const group = await getGroupById(id)
    if(group) {
        log.info('get group by ID!');
        return res.status(200).json(group)
    } else {
        log.info('user not found!');
        throw new NotFound('group not found');
    }
})

router.post('/createGroup',async(req,res)=>{
    const { permissions,name } = req.body;
    log.info('body', permissions, name);
    const { isValid, message } = permissionValidator(permissions);
    try{
        if(isValid) {
            await createGroup({name,permissions});
            log.info('group create successfully!');
            return res.send(201)
        } else {
            throw new BadRequest(message)
        }
    } catch(e) {
        throw new BadRequest(e)
    }
})

router.put('/updateGroup/:id',async(req,res)=>{
    const { id } = req.params;
    log.info('query params', id);
    const { permissions,name } = req.body;
    log.info('body', permissions, name);
    const { isValid, message } = permissionValidator(permissions);
    try{
        if(isValid) {
            await updateGroup({id,name,permissions});
            log.info('update group info successfully!');
            return res.status(200).send(`Group with ${id} updated successfully`)
        } else {
            return res.status(400).json(message)
        }
    } catch(e) {
        throw new BadRequest(e)
    }
})

router.delete('/deleteGroup/:id',async(req,res)=>{
    const { id } = req.params;
    log.info('query params',id)
    try{
        await deleteGroup(id)
        log.info('delete group in DB successfully!');
        return res.status(200).send(`Group with ${id} deleted Successfully`)
    } catch(e) {
        throw new BadRequest(e)
    }
})

router.post('/addUsersToGroup/:groupId',async(req,res)=>{
    const { groupId  } = req.params;
    const { userIds } = req.body;
    log.info('query params groupId', groupId);
    log.info('body', userIds);
    try {
        if(userIds.length === 0){
            throw new NotFound('Empty Users List!');
        }
        const group = await getGroupById(groupId);
        if(group) {
            log.info('user add in group successfully!');
            await addUsersToGroup({userIds,GroupID:groupId })
            return res.sendStatus(200)
        } else {
            throw new NotFound('group not found!');
        }
    } catch(e) {
        log.info('error', e);
        throw new BadRequest('error', e);
    }
})

module.exports = router