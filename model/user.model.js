const mongoose = require('mongoose');

const crypto = require('crypto')
const validator = require('validator');
const bcrypt = require('bcrypt');   // for hashing password

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided']
    },
    email: {
        type: String,
        required: [true, 'Email must be provided'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    role: {
        type: String,
        enum: ['customer', 'teacher', 'admin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minlength: 8,
        select: false   // Remove it from display 
    },
    passwordConfirm: {
        type: String,
        select: false,
        required: [true, 'Password must be provided'],
        validate: {
            // This only works on SAVE and CREATE methods
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
    }
}
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    // When user reset password, change this attribute to the time user reset
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }

    // password hasn't been changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;