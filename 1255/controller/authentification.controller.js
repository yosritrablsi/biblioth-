const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/authentification.model");


class UserController {
    static async signup(data) {
        try {
            const { name, prenom,email, telephone,password,role } = data;


            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error("Email already exists");
            }


            const activationCode = await this.generateActivationCode();


            const newUser = new UserModel({
                name,
                prenom,
                telephone,
                email,
                password: await this.hashdata(password),
                activationCode,
                active: false,
               role:role || 'user'
            });


            await this.sendVerificationEmail(email, activationCode);


            return { message: "User created successfully. Please check your email for confirmation.", userId: newUser._id };


        } catch (error) {
            throw error;
        }
    }




    static async login(data) {
        try {
            const { email, password } = data;
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("Invalid email or password");
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw new Error("Invalid email or password");
            }

            const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, "sjakefajefbjabfabaekbfeajeb", { expiresIn: "1h" });
            return { token, role: user.role };
        } catch (error) {
            throw error;
        }
    }

    static async sendVerificationEmail(email, activationCode) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mohamedneji7050@gmail.com',
                    pass: 'kgpyponmairtmebs',
                },
            });
            const mailOptions = {
                from: 'mohamedneji7050@gmail.com',
                to: email,
                subject: 'Confirm your email address',
                text: `Click on this link to verify your email: https://localhost:3000/Llogin/verify?activationCode=${activationCode}`,
            };

            const info = await transporter.sendMail(mailOptions);
            if (!info || !info.accepted.length) {
                throw new Error("Failed to send verification email");
            }
        } catch (error) {
            throw error;
        }
    }


    static async generateActivationCode() {
        const characters = "0123456789azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSQWXCVBN";
        let activationCode = "";
        for (let i = 0; i < 25; i++) {
            activationCode += characters[Math.floor(Math.random() * characters.length)];
        }
        return activationCode;
    }




    static async hashdata(data, saltsRounds = 12) {
        try {
            const hashedData = await bcrypt.hash(data, saltsRounds);
            return hashedData;
        } catch (error) {
            throw error;
        }
    }

    static async activateAccount(activationCode) {
        try {
            const user = await UserModel.findOne({ activationCode });
            if (!user) {
                throw new Error("Invalid activation code");
            }

            user.active = true;
            await user.save();

            return "Account activated successfully";
        } catch (error) {
            throw error;
        }
    }

    static authenticateTokenAndRole(req, res, next) {
        const token = req.headers.authorization;
        if (!token) return res.sendStatus(401);
        jwt.verify(token, "jgzfegfezjfzkljlmljzgrgzaer", (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }

    static async createAdminUser() {
        try {
            const existingAdmin = await UserModel.findOne({ email: 'admin@gmail.com' });
            if (!existingAdmin) {
                await UserModel.create({
                    name: "Admin",
                    email: "admin@gmail.com",
                    password: "adminadmin",
                    role: "admin"
                });
                console.log("Admin user created");
            } else {
                console.log("Admin user already exists");
            }
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
    }  


static  async updateprofil  (req, res) {
    try {
        const { id } = req.params;
        const { name, prenom,téléphone,password } = req.body;
        const updateprofils = await UserModel.findByIdAndUpdate(id, { name, prenom,téléphone  , password}, { new: true });
        res.json(updateprofils);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

static async deleteprofil (req, res) {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'utilisateur supprimée avec succès.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
}
module.exports = UserController;



