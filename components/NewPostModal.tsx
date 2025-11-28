import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, Post } from '../types';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'help_request' as Category,
    location: '',
    contact: ''
  });

  // Listen for custom event from desktop navbar
  useEffect(() => {
    const handleOpen = () => {
      // Since this component is conditionally rendered or controlled by parent,
      // this specific implementation relies on the parent passing isOpen=true
    };
    window.addEventListener('open-post-modal', handleOpen);
    return () => window.removeEventListener('open-post-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: Date.now().toString(),
      ...formData,
      timestamp: '剛剛',
      urgent: formData.category === 'help_request' || formData.category === 'medical'
    };
    onSubmit(newPost);
    onClose();
    setFormData({
      title: '',
      description: '',
      category: 'help_request',
      location: '',
      contact: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">新增貼文</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="new-post-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">分類</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:outline-none transition-all"
              >
                <option value="help_request">尋求協助</option>
                <option value="supplies">提供物資</option>
                <option value="volunteer">義工報名</option>
                <option value="medical">醫療需求</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">標題</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="例如：急需食水"
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">詳情</label>
              <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="請詳細描述..."
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">地點</label>
                <input 
                  required
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="例如：座數/樓層"
                  className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">聯絡電話 (選填)</label>
                <input 
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="電話號碼"
                  className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
          <button 
            type="submit" 
            form="new-post-form"
            className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md"
          >
            發佈更新
          </button>
        </div>
      </div>
    </div>
  );
};