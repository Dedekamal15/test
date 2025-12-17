import Users from '../models/userModels.js';

export const getUsers = async(req, res) =>{
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        res.json({message: error.message});
    }
}
export default Users;