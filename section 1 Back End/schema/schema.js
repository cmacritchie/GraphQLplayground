const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;


//companyType needs to be put ABOVE Userttype!!!1!

const CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:() => ({                           //closure defines fields 
        id:{type: GraphQLString},
        name: {type: GraphQLString},
        description: {type:GraphQLString},
        users: {                              //bi directional for getting all users for a company
            type: new GraphQLList(UserType),  ///says theres likely a list of users
            resolve(parentValue, args) {
                console.log('inside users');   
                console.log(parentValue, args);
                debugger;
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name:'User', //capital by convention
    fields: () => ({
        id:{ type: GraphQLString} ,
        firstName:{ type: GraphQLString } ,
        age: { type: GraphQLInt },
        company:{
            type: CompanyType,
            resolve(parentValue, args) {
                console.log(parentValue, args);
               return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(response => response.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user:{
            type: UserType,
            args: {id: {type: GraphQLString} },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp=> resp.data); //data is always added
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString} },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data);
            }
        }

        
    }
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, {firstName, age }) {
                return axios.post(`http://localhost:3000/users`, { firstName, age})
                    .then(resp => resp.data);

            }
        },
        deleteUser: {
            type:UserType, //you'll get null back!
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(resp =>resp.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(resp =>resp.data);
            }
        }

    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
});