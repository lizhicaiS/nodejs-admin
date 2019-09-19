const express = require('express')

const app = express()

app.set('secret','shsflksdj')

app.use(require('cors')())
app.use(express.json())

app.use('/uploads',express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3000,()=>{
    console.log('server is running... http://localhost:3000');
})