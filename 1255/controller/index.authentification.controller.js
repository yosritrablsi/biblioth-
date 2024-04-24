const UserController = require("./authentification.controller");




class UserModel {
    static async adduser(req, res) {
        try {
            const { name, email, password } = req.body;
            const newUserWithToken = await UserController.signup({ name, email, password });
            res.json(newUserWithToken);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
     
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, role } = await UserController.login({ email, password });
            res.json({ token, role });
        } catch (error) {
            res.status(500).json({ error: error.message });
}
    }
    static async verifyEmail(req, res) {
        try {
           
            res.json({ message: "Email verification logic" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async authenticateTokenAndRole(req,res){
        try {
            const { email, password } = req.body;
            const { token, role } = await UserController.login({ email, password });
            res.json({ token, role });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
   
    }
    


}

module.exports = UserModel;


