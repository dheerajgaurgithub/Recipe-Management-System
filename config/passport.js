const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        // Find user by username
        const user = await User.findOne({ username: username });
        
        // If no user found
        if (!user) {
          return done(null, false, { message: 'No user found with that username' });
        }

        // Match password
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};