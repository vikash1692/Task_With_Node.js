const Group = require('../models/Group');
const UserGroup = require('../models/UserGroup');
const { connection } = require('../data-access/connection');

module.exports = {
    getTransaction: async() => {
        const t = await connection.transaction();
        return t;
    },
    getAllGroups : async() => {
        const groups = await Group.findAll({
            attributes:['id','name','permissions']
        })
        return groups
    },
    getGroupById: async(id) => {
        const group  = await Group.findByPk(+id,{
            attributes:['id','name','permissions']
        })
        return group;
    },
    createGroup: async({name,permissions}) => {
        await Group.create({name,permissions},{
            fields:['name','permissions']
        })
    },
    updateGroup: async({id,name,permissions}) => {
        await Group.update({
            name,permissions
        },{
            where: {
                id
            }
        })
    },
    deleteGroup:async(id)=> {
        await Group.destroy({
            where:{
                id
            }
        })
    },
    addUsersToGroup:async({userIds,GroupID}) => {
        console.log('UserIds',userIds,GroupID)
        try {
            
            const result = await connection.transaction(async (t) => {
                for(const UserID of userIds) {
                    await UserGroup.create({UserID,GroupID},
                                {
                                transaction:t
                                })
                }
        })
        } catch (error) {
            throw new Error(error)
        } 
    }
}