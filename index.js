const dotenv = require('dotenv');
dotenv.config();

const bodyParser= require('body-parser')
const cors = require('cors')

const express = require('express');
const app = express();
app.set('view-engine', 'ejs');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json());


const TodoTask = require("./models/TodoTask");

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('connected to db');
    app.listen(8000, () => console.log('server up and running on :8000'));
});


app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.send(tasks);
    });
});

app.post('/', async (req, res) => {
    console.log(req.body);
    const todoTask = new TodoTask({
        title: req.body.title
    });
    try {
        await todoTask.save();
        res.send('added');
    }
    catch (err) {
        res.send(err);
    }
});

app.route('/edit/:id').post((req, res) => {
    const id = req.body.id;
    console.log(req.body);
    console.log(id+' updated');
    TodoTask.findByIdAndUpdate(id, {
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
        }, err => {
        if(err) return res.send(500, err);
        res.send('updated');
    });
})

app.route('/remove/:id').get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        console.log(`${id} deleted`);
        res.send('deleted');
    });
});

module.exports = app;