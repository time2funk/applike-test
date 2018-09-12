const express = require('express');
const app = express();
const config = require('./config');
const DB = require('./modules/db');

const db = new DB(config.mongoose);

app.set('port', (process.env.PORT || config.port));

app.get('/', async (request, response) => {
    try {
        await db.dropData();
        const user_result = await db.createUser({
            name: "Tester",
            email: "test@test.com"
        });
        const user_id = user_result['_id'];

        const note_result = await db.createNote({
            text: "hello world",
            user: user_id
        });
        response.send({res: note_result});
    } catch (error) {
        response.send({error: error});
    }
});

app.get('/notes', async (request, response) => {
    try {
        const list = await db.getNotes();
        response.send({notes: list});
    } catch (error) {
        response.send({error: error});
    }
});


app.listen(app.get('port'), () => {
	console.log('Node Server is running on port', app.get('port'));
});	
