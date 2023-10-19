const graphql = require('graphql');
const {GraphQLSchema, GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat} = require("graphql/type");

const {
    GraphQLObjectType,
    GraphQLBoolean
} = graphql

//Scalar Type
/*
* String = GraphQLString
* Int = GraphQLInt
* Float
* Boolean
* ID
*
* */

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a person type',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        isMarried: {
            type: GraphQLBoolean
        },
        cgpa: {
            type: GraphQLFloat
        }
    })
})


//Rootquery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {



    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,

})