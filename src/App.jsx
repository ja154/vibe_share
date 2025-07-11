import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    setShowModal(true);
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

  const handleAuthAction = (action) => {
    console.log(`${action} clicked - would redirect to authentication`);
    // In a real app, this would handle authentication
    alert(`${action} functionality would be implemented here`);
  };

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
              Get Started
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

      {/* Get Started Modal */}
      {showModal && (
              )
              }
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-card-bg border border-border-color rounded-lg p-8 max-w-md w-full mx-4">
          <div 
            className="bg-card-bg border border-border-color rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Welcome to Vibeshare!</h3>
              <p className="text-gray-300 mb-6">
                Ready to start sharing your code and creative projects? Join our community of developers and creators.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleAuthAction('Create Account')}
                  className="w-full bg-neon-green text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors"
                >
                  Create Account
                </button>
                <button 
                  onClick={() => handleAuthAction('Sign In')}
                  className="w-full border border-neon-green text-neon-green py-3 rounded-lg font-semibold hover:bg-neon-green hover:text-black transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="w-full text-gray-400 py-2 hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;