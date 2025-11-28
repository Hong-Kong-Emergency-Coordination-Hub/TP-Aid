import React from 'react';
import { Post } from '../types';
import { Card } from './Card';
import { Inbox } from 'lucide-react';

interface PostListProps {
  posts: Post[];
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-medium">暫時冇相關更新</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs">試吓調整搜尋字眼或篩選條件。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
};