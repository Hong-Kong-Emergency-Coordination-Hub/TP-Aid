import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { PostList } from './components/PostList';
import { EmergencyBanner } from './components/EmergencyBanner';
import { NewPostModal } from './components/NewPostModal';
import { Category, Post, TabType, PageType } from './types';
import { MOCK_POSTS, INFO_CATEGORIES, AID_CATEGORIES } from './constants';
import { Plus, Map, List } from 'lucide-react';
import { LiveMap } from './components/LiveMap';
import { BottomNav } from './components/BottomNav';
import { AuthProvider } from './contexts/AuthContext';
import { LoginModal } from './components/LoginModal';
import { supabase } from './services/supabaseClient';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  // Simple URL routing for Admin Dashboard
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.pathname === '/admin');

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return <MainApp />;
};

const MainApp: React.FC = () => {
  // State
  const [activePage, setActivePage] = useState<PageType>('info'); // 'info' or 'aid'
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);
  const [isLargeText, setIsLargeText] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        // Fallback to mock data if fetch fails (e.g. table doesn't exist yet)
        return;
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match Post interface
        // Note: PostGIS handling would need a more complex query or client-side parsing if not returned as GeoJSON
        const mappedPosts: Post[] = data.map((p: any) => ({
          id: p.id,
          category: p.category,
          title: p.title,
          description: p.description,
          location: p.location_text,
          timestamp: new Date(p.created_at).toLocaleString('zh-HK', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
          }),
          coordinates: p.location_geo ? {
             // Simplified parsing, ideally use ST_AsGeoJSON in query
             lat: p.location_geo.coordinates[1], 
             lng: p.location_geo.coordinates[0] 
          } : undefined,
          urgent: p.urgent,
          verified: p.is_verified,
          contact: p.contact,
          status: p.status
        }));
        setPosts(mappedPosts);
      }
    };

    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Logic to switch active categories based on page
  const currentAllowedCategories = activePage === 'info' ? INFO_CATEGORIES : AID_CATEGORIES;

  // Handle large font toggle effect
  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [isLargeText]);

  // Reset tab when page changes
  useEffect(() => {
    setActiveTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Filter and sort logic
  useEffect(() => {
    let result = [...posts];

    // 1. Filter by Page (Info vs Aid)
    result = result.filter(post => currentAllowedCategories.includes(post.category));

    // 2. Filter by Active Tab (Chips)
    if (activeTab !== 'all') {
      result = result.filter(post => post.category === activeTab);
    }

    // 3. Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.location.toLowerCase().includes(lowerQuery)
      );
    }

    // 4. Sort: Open posts first, Closed posts last
    result.sort((a, b) => {
      const statusA = a.status === 'closed' ? 1 : 0;
      const statusB = b.status === 'closed' ? 1 : 0;
      return statusA - statusB;
    });

    setFilteredPosts(result);
  }, [activePage, activeTab, searchQuery, posts, currentAllowedCategories]);

  const handleCreatePost = async (newPost: Post) => {
    // Optimistic update
    const postWithId = { ...newPost, id: Math.random().toString() }; // Temp ID
    setPosts([postWithId, ...posts]);

    // Save to Supabase
    // Note: You'll need to handle coordinates -> PostGIS Point conversion here
    const { error } = await supabase.from('posts').insert({
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      location_text: newPost.location,
      // location_geo: ... convert coordinates
      contact: newPost.contact,
      urgent: newPost.urgent,
      status: 'open'
    });

    if (error) {
      console.error('Error creating post:', error);
      // Revert optimistic update or show error
    }

    if (AID_CATEGORIES.includes(newPost.category)) {
      setActivePage('aid');
    }
  };

  const handleToggleStatus = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          status: post.status === 'closed' ? 'open' : 'closed' 
        };
      }
      return post;
    }));

    // Update Supabase
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newStatus = post.status === 'closed' ? 'open' : 'closed';
      await supabase.from('posts').update({ status: newStatus }).eq('id', postId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <Navbar 
        isLargeText={isLargeText} 
        onToggleFont={() => setIsLargeText(!isLargeText)}
        onLoginClick={() => setIsLoginOpen(true)} 
      />
      
      {/* Added bottom padding for BottomNav */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-20 pb-32 flex flex-col min-h-screen">
        
        {/* Only show Emergency Banner on Info Page for cleaner Aid view? Or keep on both? Keep on both for safety. */}
        <EmergencyBanner />
        
        {/* Sticky Header with Filter & View Toggle */}
        <div className="mt-2 sticky top-16 z-30 bg-gray-50/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gray-100 transition-all duration-200 shadow-sm">
          <FilterBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            allowedCategories={currentAllowedCategories}
          />
          
          {/* View Toggle */}
          <div className="mt-3 flex justify-between items-end">
            <h2 className="text-lg font-bold text-gray-800 pl-1 tracking-tight">
               {activePage === 'info' ? '即時資訊' : '互助請求'}
            </h2>
            <div className="bg-gray-200 p-1 rounded-lg flex items-center">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  清單
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'map' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  地圖
                </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex-1 relative min-h-[50vh]">
          {viewMode === 'list' ? (
             <PostList 
               posts={filteredPosts} 
               onStatusChange={handleToggleStatus}
             />
          ) : (
            <div className="h-[60vh] md:h-[600px] w-full">
              <LiveMap posts={filteredPosts} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - Only show on Aid page or if user wants to post */}
      {/* Moved up to avoid bottom nav */}
      <div className={`fixed bottom-24 right-6 md:right-[calc(50%-320px)] z-40 transition-transform duration-300 ${activePage === 'aid' ? 'scale-100' : 'scale-0 md:scale-100'}`}>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-xl active:scale-95 transition-transform duration-200 flex items-center justify-center border-2 border-white/20"
          aria-label="新增貼文"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost}
      />
      
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav activePage={activePage} onPageChange={setActivePage} />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;