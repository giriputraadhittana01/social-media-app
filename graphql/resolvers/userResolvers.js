const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { UserInputError } = require('apollo-server');
const dotenv = require('dotenv');
dotenv.config();
const {validateRegisterInput,validateLoginInput} = require('../../utils/validators');
const resolvers = {
    Mutation:{
        register : async (_, {registerInput : {username, password, confirmPassword, email}}, context, info) => {
            // TODO : Validate user data
            // TODO : Make sure user doesn't exist
            // TODO : Hash password and create an auth token
            const {errors, valid} = validateRegisterInput(username, password, confirmPassword, email);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken',{
                    errors : {
                        username : 'This username is taken'
                    }
                });
            }
            const encrypt_password = await bcrypt.hash(password,12);
            const newUser = new User({
                email,
                username,
                password : encrypt_password,
                createdAt : new Date().toISOString()
            });

            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id : res._id,
                token
            }
        },
        login : async (_,{username,password}) => {
            const {errors,valid} = validateLoginInput(username,password);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User Not Found';
                throw new UserInputError('User Not Found',{errors});
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials',{errors});
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id : user._id,
                token
            }
        }
    }
}

const generateToken = (user) => {
    return jwt.sign({
        id : user.id,
        email : user.email,
        username : user.username
    },process.env.SECRET_KEY,{expiresIn : '1h'});
}

module.exports = resolvers;