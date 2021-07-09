const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`

const resolvers = {
    Query:{
        sayHi : () => {
            return 'Hello World!!!!';
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(process.env.DB_SOCIAL, {useNewUrlParser : true,useUnifiedTopology : true})
    .then(() => {
        console.log('DB Connected');
        const PORT = 8000;
        server.listen({port : PORT})
            .then((res) => {
                console.log(`Server listening on ${res.url}`);
            })
            .catch((err) => {
                console.log('Something went wrong, please try again later');
            })
    })
    .catch((res) => {
        console.log(`Can't Connect with DB`);
        console.log(res);
    })
