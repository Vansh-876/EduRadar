const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: { type: String, default: '/images/default-profile.jpg' }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model('User', userSchema);

module.exports = User;