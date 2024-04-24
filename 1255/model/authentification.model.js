const mongoose = require("mongoose");


    const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      
      
      prenom: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 7
      },
       téléphone : {type:String,
       required:true,
        length: 8},
        
      activationCode: { type: String },
      active: { type: Boolean, default: false },
      role: { type: String, enum: ['user', 'admin','enseignant','bibliothecaire', 'repographe'], default: 'user' }
    });
   
    const UserModel = mongoose.model("User", userSchema);
    module.exports = UserModel;
