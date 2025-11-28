import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminPosts();
    }
  }, [isAdmin]);

  const fetchAdminPosts = async () => {
    setFetchLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setPosts(data || []);
    setFetchLoading(false);
  };

  const handleVerify = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_verified: !currentStatus })
      .eq('id', id);
    
    if (!error) fetchAdminPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (!error) fetchAdminPosts();
  };

  const handleClose = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'closed' ? 'open' : 'closed';
    const { error } = await supabase
      .from('posts')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchAdminPosts();
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  
  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={fetchAdminPosts}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {fetchLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Content</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.profiles?.email || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                        {post.is_verified && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(post.id, post.is_verified)}
                            className={`p-1 rounded hover:bg-gray-100 ${post.is_verified ? 'text-blue-600' : 'text-gray-400'}`}
                            title="Toggle Verify"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleClose(post.id, post.status)}
                            className={`p-1 rounded hover:bg-gray-100 ${post.status === 'closed' ? 'text-orange-600' : 'text-gray-400'}`}
                            title="Toggle Open/Closed"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1 rounded hover:bg-gray-100 text-red-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

