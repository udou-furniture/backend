const app = require('./app')
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

// heroku wont always use port 5000
const PORT = process.env.PORT || 5000

const dbConfig = {useNewUrlParser: true, useUnifiedTopology: true}

mongoose.connect(process.env.DB_URL, dbConfig, (err) => {
    if(err) {
        console.log('error connecting to mongo')
    } else {
        console.log('Connected to MongoDB')
    }
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))