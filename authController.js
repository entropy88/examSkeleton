const router = require('express').Router();
const {body, validationResult} = require('express-validator');
const {isGuest,isUser} = require('../middlewares/guards')

router.get('/register',isGuest(), (req, res) => {
    res.render('register');
});

router.post('/register',isGuest(),
    body('username').isLength({min: 3}).withMessage('Username must be atleast 3 chars'),
    body('rePassword').custom((value, {req}) => {
        if (value != req.body.password) {
            throw new Error('passwords dont match');
        }
        return true;
    }),
   async (req, res) => {
        console.log(req.body);
        const {errors}=validationResult(req);
        
        try{
        if (errors.length>0){
            console.log(errors)
            throw new Error('Validation error')
        }
     await req.auth.register(req.body.username,req.body.password);
     console.log('user registered')
        res.redirect('/');
    } catch (err) {
        console.log(err)
        const ctx={
            errors,
            userData: {
                username:req.body.username
            }
        };
        res.render('register',ctx)
    }

    })

router.get('/login',isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login',isGuest(), async (req, res) => {
   try{
       console.log(req.body.username, req.body.password)
       await req.auth.login(req.body.username, req.body.password);
       res.redirect('/')

   } catch(err){
    console.log(err.message)
    const ctx={
        errors:[err.message],
        userData: {
            username:req.body.username
        }
    };
    res.render('login',ctx)
   }
});

router.get('/logout', (req, res)=>{
    req.auth.logout();
    res.redirect('/')
})

module.exports = router;