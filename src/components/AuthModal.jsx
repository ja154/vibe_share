import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthModal = ({ showModal, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create profile in profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                name: name,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          setSuccess('Account created successfully! Please check your email to verify your account.');
          setEmail('');
          setPassword('');
          setName('');
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccess('Signed in successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card-bg border border-border-color rounded-lg p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">🚀</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-gray-300">
            {isSignUp 
              ? 'Join our community of developers and creators' 
              : 'Sign in to your Vibeshare account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-green text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-neon-green hover:text-green-400 transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full text-gray-400 py-2 mt-4 hover:text-white transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default AuthModal;