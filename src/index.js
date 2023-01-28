const { ApolloServer, gql } = require("apollo-server");
const axios = require('axios');


const typeDefs = gql`
  type Book {
    id: String  
    title: String
    author: String
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!):[Book]
    Getquote: [Quote]
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book 
      CreateBrequ(quote: String!, author: String!): Quote

  }

  type Quote {
    quote: String,
    author: String
  }
`;
let breaking = [];

let books = [
    {
      id:"1",
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      id:"2",  
      title: 'City of Glass',
      author: 'Paul Auster',
    },
    {
       id:"3",  
       title: 'Del amor y otros demonios',
       author: 'Gabriel garcia Marquez',
    }
  ];
  const resolvers = {
    Mutation: {
        CreateBrequ: (_,arg) => {breaking.push(arg); return arg},
        CreateBook: (_,arg) => {books.push(arg); return arg},
                           
    },  
    Query: {
      Getbooks: () => books,
      Getbook: (_,arg) => [books.find(number => number.id==arg.id)],
      Getquote: async () => {
        const {data: breakingquotes} = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes/10')
        breaking = breakingquotes;
        return breakingquotes}
    },
  };


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});