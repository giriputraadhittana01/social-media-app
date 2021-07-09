const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { AuthenticationError } = require('apollo-server');
dotenv.config();
const checkAuthToken = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        // Bearer ${TOKEN}
        // console.log(authHeader);
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token,process.env.SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid / Expired Token');
            }
        }
        throw new Error('Authentiacation token must be \`Bearer {TOKEN}\`');
    }
    throw new Error('Authorization header must be provided');
}

module.exports = checkAuthToken;