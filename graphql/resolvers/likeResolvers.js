const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

const resolvers = {
    Query:{
        
    },
    Mutation : {
        likePost : async (_,{postId},context) => {
            const {username} = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(post){
                    if(post.likes.find((like) => like.username == username)){
                        post.likes = post.likes.filter((like) => like.username!=username);
                    }else{
                        post.likes.push({
                            username,
                            createdAt : new Date().toISOString()
                        })
                    }
                    await post.save();
                    return post;
                }
            }catch(err){
                throw new UserInputError('Post Not Found');
            }
        }
    }
}

module.exports = resolvers;