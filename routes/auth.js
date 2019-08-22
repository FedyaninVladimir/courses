const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
    res.render('auth/login'),
    {
        title: 'Авторизация',
        isLogin: true
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    }) 
})
router.post('/login',  async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            }
            else {
                res.redirect('/auth/login')
            }
        }
        else {
            res.redirect('/auth/login')
        }
    }
    catch(e) {
        console.log(e)
    }
})
router.post('/register', async (req, res) => {
    try {
        const {email, password,  name} = req.body 
        const candidate = await User.findOne({email})

        if (candidate) {
            res.redirect('/auth/login')
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,name, password: hashPassword, cart: {items: []}
            })
            console.log(user, password)
            await user.save()
            res.redirect('/auth/login')
        }
    }
    catch (e) {
        console.log(e)
    }
})
module.exports = router