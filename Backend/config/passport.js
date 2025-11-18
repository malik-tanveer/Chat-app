import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';

// ✅ TEMPORARY: Hardcode test credentials (Replace with actual ones)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google Profile Received:', profile.displayName);
      
      // Check if user already exists with Google ID
      let user = await User.findOne({ 
        where: { googleId: profile.id } 
      });

      if (user) {
        console.log('Existing Google user found:', user.username);
        return done(null, user);
      }

      // Check if user exists with email
      user = await User.findOne({ 
        where: { email: profile.emails[0].value } 
      });

      if (user) {
        // Update existing user with Google ID
        await user.update({
          googleId: profile.id,
          avatar: profile.photos[0].value
        });
        console.log('Existing user updated with Google ID:', user.username);
        return done(null, user);
      } else {
        // Create new user with Google
        const username = profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substring(2, 8);
        
        user = await User.create({
          username: username,
          email: profile.emails[0].value,
          password: null, // No password for Google users
          googleId: profile.id,
          avatar: profile.photos[0].value,
          isOnline: true
        });
        console.log('New Google user created:', user.username);
        return done(null, user);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
  console.log('✅ Google OAuth Strategy loaded');
} else {
  console.log('⚠️  Google OAuth disabled - No credentials provided');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;