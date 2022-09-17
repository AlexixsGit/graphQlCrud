
const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { uuid } = require('uuid')

const persons = [
    {
        name: "Midu",
        phone: "034-1234567",
        street: "Calle frontend",
        city: "Barcelona",
        id: "09393993939-939393-93939-9393939393"
    }, {
        name: "Yourself",
        phone: "034-1234567",
        street: "Avenida fullstack",
        city: "Mataro",
        id: "123333993939-939393-93939-9393939393"
    }, {
        name: "Itzi",
        street: "Pasaje testing",
        city: "Ibiza",
        id: "4443993939-939393-93939-9393939393"
    }
]

/**Definiciones de los datos */
const typeDefinitions = gql`
type Person{
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
}

type Query{
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
    
}

type Mutation{
    addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
    ): Person
}
`

const resolver = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const { name } = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            const person = { ...args, id: uuid }
            persons.push(person)
            return person
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers: resolver
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
});


