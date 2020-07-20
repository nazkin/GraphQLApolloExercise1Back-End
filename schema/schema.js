const graphql = require('graphql');
const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Song = require('../models/Song');

//Next step, add mutation and make sure that database additions are used instead of dummy data 

const {GraphQLObjectType,
     GraphQLID,
     GraphQLString,
     GraphQLInt,
     GraphQLSchema, 
     GraphQLList,
     GraphQLNonNull} = graphql;

// var songs = [
//     { name: 'Name of the Wind', genre: 'Rap', id: '1' , artistId: "1"},
//     { name: 'The Final Empire', genre: 'Classic', id: '2', artistId: "1" },
//     { name: 'The Long Earth', genre: 'Punk Rock', id: '3', artistId: "3" },
//     {name: 'The Lion King', genre: "Movie Theme", id: '4', artistId: "2"}
// ];

// var artists = [
//     { name: 'Patrick Rothfuss', age: 44, id: "1"},
//     { name: 'Brandon Sanderson', age: 42, id: "2" },
//     { name: 'Terry Pratchett', age: 66, id: "3"}
// ];
const SongType = new GraphQLObjectType({
    name: 'Song',
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        artist: {
            type: ArtistType,
            resolve(parent, args){
                return Artist.findById(parent.artistId);
            }
        }
    })
});

const ArtistType = new GraphQLObjectType({
    name: 'Artist',
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        songs: {
            type: new GraphQLList(SongType),
            resolve(parent, args){
               
                return Song.find({artistId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        song:{
            type: SongType,
            args: { id:{ type: GraphQLID } },
            resolve(parent, args){
                return Song.findById(args.id);
            }
        },
        songs:{
            type: new GraphQLList(SongType),
            resolve(parent, args){
                return Song.find({});
            }
        },
        artist: {
            type: ArtistType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Artist.findById(args.id);
            }
        },
        artists: {
            type: new GraphQLList(ArtistType),
            resolve(parent, args){
                return Artist.find({});
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addArtist:{
            type: ArtistType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let artist = new Artist({
                    name: args.name,
                    age: args.age
                });
                return artist.save();
            }
        },
        addSong: {
            type: SongType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                artistId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let song = new Song({
                    name: args.name,
                    genre: args.genre,
                    artistId: args.artistId
                });
                return song.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});

