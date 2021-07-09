const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/indexResolvers');
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => ({req,pubsub})  
});

mongoose.connect(process.env.DB_SOCIAL, {useNewUrlParser : true,useUnifiedTopology : true})
    .then(() => {
        console.log('DB Connected');
        const PORT = process.env.PORT || 8000;
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
