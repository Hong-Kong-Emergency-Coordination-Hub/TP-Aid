import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { PostList } from './components/PostList';
import { EmergencyBanner } from './components/EmergencyBanner';
import { NewPostModal } from './components/NewPostModal';
import { Category, Post, TabType } from './types';
import { MOCK_POSTS } from './constants';
import { Plus } from 'lucide-react';
import { SmartAssistant } from './components/SmartAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);

  // Filter logic
  useEffect(() => {
    let result = posts;

    if (activeTab !== 'all') {
      result = result.filter(post => post.category === activeTab);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.location.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredPosts(result);
  }, [activeTab, searchQuery, posts]);

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 relative">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 pt-20">
        <EmergencyBanner />
        
        <div className="mt-6 sticky top-16 z-30 bg-gray-50/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gray-100 transition-all duration-200">
          <FilterBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="mt-4">
          <PostList posts={filteredPosts} />
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform duration-200 flex items-center justify-center"
          aria-label="新增貼文"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop/Modal create post */}
      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost}
      />
      
      {/* AI Assistant - Subtle integration */}
      <div className="fixed bottom-6 left-6 z-40">
         <SmartAssistant />
      </div>

    </div>
  );
};

export default App;