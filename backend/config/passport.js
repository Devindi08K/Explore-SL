const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Make the callback URL dynamic and remove the /api prefix
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || !profile.emails.length) {
      return done(new Error('No email found in Google profile'), null);
    }
    const email = profile.emails[0].value;
    let user = await User.findOne({ email: email });

    if (!user) {
      // Create a new user without a password
      user = await User.create({
        // Ensure username is unique by appending random numbers if needed
        userName: profile.displayName.replace(/\s/g, '') + Math.floor(1000 + Math.random() * 9000),
        email: email,
        socialId: profile.id,
        socialProvider: 'google',
        emailVerified: true // Google emails are already verified
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));
