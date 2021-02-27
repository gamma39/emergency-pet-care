const path = require('path')
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
require('./db/mongoose')
const userRouter = require('./routers/user')
const indexRouter = require('./routers/index')
const app = express()
console.log(__dirname + '..' + '/public')


app.use(expressLayouts)
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

const port = process.env.PORT
 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

//set up express-session so flash messages can be sent to user after registration
app.use(session({ 
    secret:'thisisasecretdonttellanyone', 
    saveUninitialized: true, 
    resave: true
})); 

//connect flash
app.use(flash())

//Routes
app.use(express.static('public'))
app.use('/', indexRouter)
app.use(userRouter)


//set up instance of express to listen to the created port 
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})