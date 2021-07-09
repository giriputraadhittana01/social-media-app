const { AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');
const resolvers = {
    Query:{
        getPosts : async () => {
            try{
                const posts = await Post.find().sort({createdAt : -1});
                return posts;
            }catch(err){
                throw new Error(err);
            }
        },
        getPost : async (_,{postId}) => {
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post Not Found');
                }
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation : {
        createPost : async (_,{body},context) => {
            const user = checkAuth(context);
            // console.log(user);
            if(body.trim()==''){
                throw new Error('Post body must be fill');
            }
            const newPost = new Post({
                body,
                user : user.id,
                username : user.username,
                createdAt : new Date().toISOString()
            });
            const post = await newPost.save();
            context.pubsub.publish('NEW_POST',{
                newPost : newPost
            })
            return post;
        },
        deletePost : async (_,{postId},context) => {
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(user.username==post.username){
                    await post.delete();
                    return 'Post Deleted Successfully';
                }else{
                    throw new AuthenticationError('Action Not Allowed');
                }
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Subscription : {
        newPost : {
            subscribe: (_,__,{pubsub}) => {
                return pubsub.asyncIterator('NEW_POST');
            }
        }
    }
}

module.exports = resolvers;