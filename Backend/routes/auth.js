import express from 'express';
import passport from '../config/passport.js';
import { register, login, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Existing routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

// ✅ Google OAuth Routes - Always enable for testing
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
    session: false 
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES }
      );

      const userData = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        isOnline: true
      };

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect('http://localhost:5173/login?error=auth_failed');
    }
  }
);

// Google OAuth status check
router.get('/google/status', (req, res) => {
  res.json({
    success: true,
    message: 'Google OAuth is enabled',
    clientId: !!process.env.GOOGLE_CLIENT_ID,
    clientSecret: !!process.env.GOOGLE_CLIENT_SECRET
  });
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        isOnline: req.user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

export default router;