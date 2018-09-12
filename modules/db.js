const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Propmise = global.Promise;
const User = require("./models/user");
const Note = require("./models/note");

module.exports = class {
    constructor(config){
        console.log('db constructor');
        mongoose.connect(config.uri, { useNewUrlParser: true });
    }
  
    createUser(data){
        console.log('db create user');
        return new Promise( (resolve, reject) => {
            new User({
                "name": data["name"],
                "email": data["email"]
            }).save((err, result) => {
                (err)
                ? reject(err)
                : resolve(result);
            });
        });
    }

    createNote(data){
        console.log('db create note');
        return new Promise( (resolve, reject) => {
            new Note({
                "text": data["text"],
                "user": data["user"]
            }).save((err, result) => {
                (err)
                ? reject(err)
                : resolve(result);
            });
        });
    }
  
    async getNotes() {
        console.log('db getNotes');
        var users = [];
        var notes = [];

        await User.find({},function(err, result) {
            users = result;
        });

        await Note.find({},function(err, result) {
            notes = result;
        });

        const result = await notes.map(item => {
            const id = item.user;
            var new_item = item;
            var user;

            for(let i=0; i<users.length; i++) {
                if(users[i]._id.toString() === id.toString()){
                    new_item.user = users[i];
                    break;
                }                    
            }

            if(user)
                return new_item;
            else 
                return item;
        });
        return result;
    }

    async dropData() {
        try {
            await mongoose.connection.collections.notes.drop();
            await mongoose.connection.collections.users.drop();
        } catch (error) {
            console.log(error);
        }
    }
}