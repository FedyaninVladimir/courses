const express = require('express')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://vladimir:Southpark-1@cluster0-jnm09.mongodb.net/shop'

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use("/auth", authRoutes)
app.use("/orders", ordersRoutes)
app.use("/",homeRoutes)
app.use("/add",addRoutes)
app.use("/courses",coursesRoutes)
app.use("/cart", cartRoutes)

const PORT =  3000
// const password = 'Southpark-1'

async function start() {
    try {
        await  mongoose.connect(MONGODB_URI, {useNewUrlParser: true,useFindAndModify: false})
    
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}
start()


