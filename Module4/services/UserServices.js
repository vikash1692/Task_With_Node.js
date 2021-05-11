const User = require('../models/User');
module.exports ={
    getAllUsers : async() => {
        const users = await User.findAll({
            attributes:['id','login','password','age','isDeleted']
        })
        return users
    },
    getUserById : async(id) => {
        const user = await User.findByPk(Number(id),{
            attributes:['id','login','password','age','isDeleted']
        })
        return user
    },
    createUser: async(login,password,age) => {
        await User.create({login,password,age},{
            fields:['login','password','age','isDeleted']
        })
    },
    updateUser:async(login,password,age,id) => {
        await User.update({
            login,password,age
        },{
            where: {
                id
            }
        })
    },
    deleteUser:async(id)=> {
        await User.destroy({
            where:{
                id
            }
        })
    }, 
    getAutoSuggestUsers:async(login)=>{
        const users = await this.getAllUsers();
        return users.sort((a,b)=>(a.login > b.login) ? 1 : ((b.login > a.login) ? -1 : 0))
        .filter(user => user.login.replace(/ /g,'').toLowerCase() === login.replace(/ /g,'').toLowerCase())
    }
}