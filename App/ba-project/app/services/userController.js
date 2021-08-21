const User = require ('../models/user');


// FETCH All Users
exports.getAll = (req, res) => {
    User.find()
        .exec()
        .then(users => {
            console.log('Sending users')
            res.send(users)
        })
        .catch((error) => {
            console.log(error.message);
            return[];
        })
}

// CREATE a new User
exports.create = (req, res) => {
    const user = new User({
        full_name: req.body.full_name,
        username: req.body.username,
        password: req.body.password,
        attributes: req.body.attributes,
        projects: [],
    });

    // Save User in MongoDB
    user.save()
    .then(data => {
        res.send(data);
        console.log("New User Saved!")
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

// FIND ONE User with Username and compare password
exports.logIn = (req, res) => {
    User.findOne({ username: req.body.username }, function(err, user){
        user.comparepassword(req.body.password, (err, isMatch)=> {
            if(!isMatch) {
                return res.status(404).send({
                    message: 'Password doesn`t match!'
                })
            }   
        })
    })
    .then(user => {
        if(!user) {
            return res.status(500).send({
                message: `User not found ${req.body.username}`
            })
        }
        res.status(200).send({
            message: `Successfully logged in ${req.body.username}`
        })
    }).catch(err => {
        return res.status(500).send({
            message: `Error retrieving User with Username: ${req.body.username} ${err.message}`
        })
    })
}

// FIND ONE User with Username and compare password
exports.findOne = (req, res) => {
    User.findOne({ username: req.params.username })
    .then(user => {
        if(!user) {
            return res.status(500).send({
                message: `User not found ${req.params.username}`
            })
        }
        let foundUser = {
            username: user.username,
            full_name: user.full_name,
        }
        res.send(foundUser)
    }).catch(err => {
        return res.status(500).send({
            message: `Error retrieving User with Username: ${req.params.username} ${err.message}`
        })
    })
}

// UPDATE a Project with Id
exports.update = (req, res) => {
    // Find project and update it
    User.updateOne({_id: req.params.id}, {
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        projects: [],
    }, {new: true})
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: `User not found with Id  ${req.params.id}`
            });
        }
        res.send(project);
    }).catch(err => {
        return res.status(500).send({
            message: `Error updating User with Id ${req.params.id} ${err.message}`
        });
    });
}

// DELETE a Project
exports.delete =(req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: `User not found with Id ${req.params.id}`
            });
        }
        res.send({message: 'User deleted successfully!'});
    }).catch(err => {
        return res.status(500).send({
            message: `Error delete User with Id ${req.params.id} ${err.message}`
        });
    })
}