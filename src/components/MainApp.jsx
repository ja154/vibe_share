import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PostCard = ({ post, currentUser, onReaction }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', post.user_id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [post.user_id]);

  const handleReaction = async (reactionType) => {
    if (!currentUser) return;
    
    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', currentUser.id)
        .single();

      if (existingReaction) {
        // Update existing reaction
        await supabase
          .from('reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existingReaction.id);
      } else {
        // Create new reaction
        await supabase
          .from('reactions')
          .insert({
            post_id: post.id,
            user_id: currentUser.id,
            reaction_type: reactionType
          });
      }
      
      onReaction();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-neon-green rounded-full flex items-center justify-center mr-3">
          <span className="text-black font-bold">
            {profile?.name?.charAt(0) || '?'}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-white">{profile?.name || 'Anonymous'}</h4>
          <p className="text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
      {post.description && (
        <p className="text-gray-300 mb-4">{post.description}</p>
      )}
      
      {post.media_url && (
        <img 
          src={post.media_url} 
          alt="Post media" 
          className="w-full rounded-lg mb-4 max-h-96 object-cover"
        />
      )}
      
      {post.code_link && (
        <a 
          href={post.code_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-neon-green text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors mb-4"
        >
          View Code
        </a>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-primary-bg text-neon-green px-3 py-1 rounded-full text-sm border border-neon-green"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-4 pt-4 border-t border-border-color">
        <button 
          onClick={() => handleReaction('fire')}
          className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <span>🔥</span>
          <span>Fire</span>
        </button>
        <button 
          onClick={() => handleReaction('heart')}
          className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <span>❤️</span>
          <span>Love</span>
        </button>
        <button 
          onClick={() => handleReaction('idea')}
          className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <span>💡</span>
          <span>Idea</span>
        </button>
      </div>
    </div>
  );
};

const CreatePostModal = ({ showModal, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
          media_url: mediaUrl || null,
          code_link: codeLink || null,
          tags: tagsArray.length > 0 ? tagsArray : null
        });

      if (error) throw error;

      // Reset form
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setCodeLink('');
      setTags('');
      
      onPostCreated();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card-bg border border-border-color rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 text-white">Create New Post</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="What did you build?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="Tell us about your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Media URL
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Code Link
            </label>
            <input
              type="url"
              value={codeLink}
              onChange={(e) => setCodeLink(e.target.value)}
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-primary-bg border border-border-color rounded-lg text-white focus:outline-none focus:border-neon-green"
              placeholder="react, javascript, web-dev (comma separated)"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-neon-green text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border-color text-gray-300 py-3 rounded-lg font-semibold hover:border-neon-green transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MainApp = ({ user, onSignOut }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  console.log('MainApp rendered for user:', user?.email);

  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setUserProfile(data);
      } else {
        // Profile will be created by database trigger
        console.log('Profile not found, should be created by trigger');
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } else {
        console.log('Posts fetched:', data);
      setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleReaction = () => {
    fetchPosts(); // Refresh posts to update reaction counts
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="border-b border-border-color sticky top-0 bg-primary-bg z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">V</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Vibeshare
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-neon-green text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors"
              >
                Create Post
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">
                    {userProfile?.name?.charAt(0) || user.email?.charAt(0) || '?'}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-gray-300 hover:text-neon-green transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userProfile?.name || user.email?.split('@')[0] || 'Creator'}! 👋
          </h2>
          <p className="text-gray-300">
            Share your latest projects and see what the community is building.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-card-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-300 mb-6">
              Be the first to share your project with the community!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-neon-green text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onReaction={handleReaction}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default MainApp;