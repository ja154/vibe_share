import React, { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import MainApp from './components/MainApp';
import { supabase } from './lib/supabase';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-primary-bg border border-border-color rounded-lg p-6 hover:border-neon-green transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      setUser(session?.user ?? null);
    };
    
    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      alert('You are already signed in!');
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth' 
      });
    } else {
      console.warn('Features section not found');
    }
  };

  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth' 
      });
    } else {
      console.warn(`Section ${sectionId} not found`);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  // Debug: Log current user state
  console.log('Current user state:', user);
  console.log('User authenticated:', !!user);

  // Force show MainApp for debugging - remove this later
  const forceShowMainApp = true;

  // If user is authenticated, show the main app
  if (user || forceShowMainApp) {
    console.log('Rendering MainApp for user:', user?.email);
    return <MainApp user={user || { id: 'demo', email: 'demo@example.com' }} onSignOut={handleSignOut} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-green text-lg">Loading Vibeshare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">V</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Vibeshare: <span className="text-neon-green">Code & Create</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavClick('features')} 
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                Features
              </button>
              <button 
                onClick={() => handleNavClick('about')} 
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('contact')} 
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                Contact
              </button>
              {user && (
                <button 
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Share Your <span className="text-neon-green animate-pulseSlow">Vibe</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeIn">
            A platform where creativity meets code. Share your projects, collaborate with others, 
            and build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <button 
              onClick={handleGetStarted}
              className="bg-neon-green text-black px-8 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors"
            >
              {user ? 'Welcome Back!' : 'Get Started'}
            </button>
            <button 
              onClick={handleLearnMore}
              className="border border-neon-green text-neon-green px-8 py-3 rounded-lg font-semibold hover:bg-neon-green hover:text-black transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="💻"
              title="Code Sharing"
              description="Share your code snippets and projects with the community"
            />
            <FeatureCard
              icon="🎨"
              title="Creative Tools"
              description="Access powerful tools to bring your creative ideas to life"
            />
            <FeatureCard
              icon="🤝"
              title="Collaboration"
              description="Work together with other developers and creators"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8">About Vibeshare</h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            Vibeshare is more than just a platform—it's a community where developers, 
            designers, and creators come together to share their passion for building 
            amazing things. Whether you're sharing code, showcasing designs, or 
            collaborating on projects, Vibeshare provides the tools and community 
            you need to succeed.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-neon-green rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">V</span>
              </div>
              <span className="text-gray-300">© 2025 Vibeshare. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => alert('Privacy Policy would be displayed here')}
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button 
                onClick={() => alert('Terms of Service would be displayed here')}
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button 
                onClick={() => alert('Support page would be displayed here')}
                className="text-gray-300 hover:text-neon-green transition-colors cursor-pointer"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal showModal={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default App;