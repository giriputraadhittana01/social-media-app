const postResolvers = require('./postResolvers');
const userResolvers = require('./userResolvers');
const commentResolvers = require('./commentResolvers');
const likeResolvers = require('./likeResolvers');

const combineResolvers = {
    // Will run every returned of the post
    Post : {
        likeCount : (parent) => {
            return parent.likes.length;
        },
        commentCount : (parent) => {
            return parent.comments.length;
        }
    },
    Query : {
        ...commentResolvers.Query,
        ...postResolvers.Query,
        ...likeResolvers.Query
    },
    Mutation : {
        ...commentResolvers.Mutation,
        ...postResolvers.Mutation,
        ...userResolvers.Mutation,
        ...likeResolvers.Mutation
    },
    Subscription : {
        ...postResolvers.Subscription
    }
}

module.exports = combineResolvers;