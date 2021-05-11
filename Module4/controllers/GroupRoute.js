  
const express = require('express');
const { permissionValidator } = require('../utils');
const { getAllGroups,getGroupById, createGroup, updateGroup, deleteGroup, addUsersToGroup } = require('../services/GroupService');

const router = express.Router();

router.get('/', async(req, res) => {
    const groups = await getAllGroups();
    return  res.status(200).json(groups)
})

router.get('/:id',async(req,res)=>{
    const { id } = req.params;
    const group = await getGroupById(id)
    if(group) {
        return res.status(200).json(group)
    } else {
        return res.statusCode(404)
    }
})

router.post('/createGroup',async(req,res)=>{
    const { permissions,name } = req.body;
    const { isValid, message } = permissionValidator(permissions);
    try{
        if(isValid) {
            await createGroup({name,permissions});
            return res.send(201)
        } else {
            return res.status(400).json(message)
        }
    } catch(e) {
        return res.send(502).json(e)
    }
})

router.put('/updateGroup/:id',async(req,res)=>{
    const { id } = req.params;
    const { permissions,name } = req.body;
    const { isValid, message } = permissionValidator(permissions);
    try{
        if(isValid) {
            await updateGroup({id,name,permissions});
            return res.status(200).send(`Group with ${id} updated successfully`)
        } else {
            return res.status(400).json(message)
        }
    } catch(e) {
        return res.send(502).json(e)
    }
})

router.delete('/deleteGroup/:id',async(req,res)=>{
    const { id } = req.params;
    try{
        await deleteGroup(id)
        return res.status(200).send(`Group with ${id} deleted Successfully`)
    } catch(e) {
        return res.send(502).json(e)
    }
})

router.post('/addUsersToGroup/:groupId',async(req,res)=>{
    const { groupId  } = req.params;
    const { userIds } = req.body;
    try {
        if(userIds.length === 0) return res.send(400).json('Empty Users List')
        const group = await getGroupById(groupId);
        if(group) {
            await addUsersToGroup({userIds,GroupID:groupId })
            return res.sendStatus(200)
        } else {
            return res.sendStatus(502)
        }
    } catch(e) {
        console.log(e)
        return res.sendStatus(502)
    }
})

module.exports = router