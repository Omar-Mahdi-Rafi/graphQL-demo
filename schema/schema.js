const graphql = require('graphql');
var _ = require('lodash');
const {GraphQLObjectType, GraphQLList} = require("graphql/type");

//dummy data
const usersData = [
    {id: '1', name: 'Bond', age: '21', profession: 'Police Officer'},
    {id: '2', name: 'Anna', age: '56', profession: 'Technician'},
    {id: '3', name: 'Chris', age: '25', profession: 'School Teacher'},
    {id: '4', name: 'Gone', age: '26', profession: 'Musician'},
    {id: '5', name: 'Case', age: '19'},
    {id: '6', name: 'Hope', age: '25'},
    {id: '7', name: 'Ceaser', age: '26'},
    {id: '8', name: 'Nojo', age: '19'}
];

const hobbiesData = [
    {id: '1', title: 'Programming', description: "Using computers to make the world a better place", userId: "1"},
    {id: '2', title: 'Swimming', description: "What do you know about rolling down in the deep? I am an astronaut in the ocean.", userId: "2"},
    {id: '3', title: 'Gardening', description: "Strawberries, cherries and an angel's kiss in spring", userId: "3"},
    {id: '4', title: 'Hiking', description: "On to the top!", userId: "4"},
    {id: '5', title: 'Shooting', description: "Using computers to make the world a better place", userId: "5"},
    {id: '6', title: 'Adventure', description: "Using computers to make the world a better place", userId: "7"},
];

const postsData = [
    {id: '1', postBody: 'First Post', comment: 'This is lorem ipsum doler simit arsu, Gonna Make you rock n roll...', userId: "1"},
    {id: '2', postBody: 'Second Post', comment: 'This is lorem ipsum doler simit arsu, Gonna make your run all night...', userId: "1"},
    {id: '3', postBody: 'Third Post', comment: 'This is lorem ipsum doler simit arsu, The West is Doomed...', userId: "3"},
    {id: '4', postBody: 'Fourth Post', comment: 'This is lorem ipsum doler simit arsu, Please take it easy...', userId: "2"},
    {id: '5', postBody: 'Fifth Post', comment: 'This is lorem ipsum doler simit arsu, We don\'t know what to do right now...', userId: "2"},
    {id: '6', postBody: 'Sixth Post', comment: 'This is lorem ipsum doler simit arsu, its gonna be alright, listen to the sky hymning with the blow of wind from the north...', userId: "4"}

];

const {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema

} = graphql

//Create Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return _.filter(postsData, {userId: parent.id});
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return _.filter(hobbiesData, {userId: parent.id} )
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'This type describes the hobbies of the users',
    fields: () => ({
       id: {type: GraphQLString},
       title: {type: GraphQLString},
       description: {type: GraphQLString},
        user: {
           type : UserType,
            resolve(parent, args){
               return _.find(usersData, {id: parent.userId})
            }
        }
    }),
});

const PostType = new GraphQLObjectType({
   name: 'Post',
   description: 'This type describes the Posts created by the users.',
    fields: () => ({
        id: {type: GraphQLString},
        postBody: {type: GraphQLString},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId});
            }
        }
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args) {
                //get and return data from datasource

                return _.find(usersData, {id: args.id});

            }
        },
        //Querying all users
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return usersData;
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
                //return data for our hobby
               return _.find(hobbiesData, {id: args.id})

            }
        },
        post: {
            type: PostType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent, args){
                return _.find(postsData, {id: args.id})
            }
        }
    }
});

//Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //CreateUser Mutation
        createUser: {
            type: UserType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                age: {type: GraphQLString},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }
                return user;
            }
        },
        //CreatePost Mutation
        createPost: {
            type: PostType,
            args: {
                userId: {type: GraphQLString},
                postBody: {type: GraphQLString},
                comment: {type: GraphQLString}
            },
            resolve(parent, args) {
                let post = {
                    postBody: args.postBody,
                    comment: args.comment,
                    userId: args.userId
                }
                return post;
            }
        },
        //CreateHobby Mutation
        createHobby: {
            type: HobbyType,
            args: {
                userId: {type: GraphQLString},
                title: {type: GraphQLString},
                description: {type: GraphQLString}
            }, resolve(parent, args){
                let hobby = {
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                }
                return hobby;
            }
        }

    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

