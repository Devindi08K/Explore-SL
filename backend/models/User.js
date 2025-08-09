const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        // Password is not required if signing up via a social provider
        required: function() { return !this.socialProvider; }
    },
    role: {
        type: String,
        enum: ['admin', 'regular'],
        default: 'regular',
    },
    socialId: String,
    socialProvider: {
        type: String,
        enum: ['google', 'facebook', null],
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    isVerified: { type: Boolean, default: true }, // Changed from false to true to allow immediate login
    emailVerified: { type: Boolean, default: false } // New field to track actual email verification status
}, {
    timestamps: true // Add this line to automatically manage createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new) and exists
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison:', {
            candidatePassword,
            hashedPassword: this.password,
            isMatch
        });
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema);