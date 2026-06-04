'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useFeed } from '@/features/home/hooks/useFeed';
import { Post } from '@/features/home/models/postModel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MessageSquare, Send, ImageIcon, Paperclip } from 'lucide-react';

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const initials = post.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-start gap-3'>
          <Avatar className='h-10 w-10 shrink-0'>
            <AvatarFallback className='text-xs bg-primary/10 text-primary font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='font-semibold text-sm text-foreground'>{post.author}</span>
              <span className='text-xs text-muted-foreground'>{post.role}</span>
              {post.isImportant && (
                <Badge variant='danger' className='text-xs'>Aviso Importante</Badge>
              )}
              <span className='text-xs text-muted-foreground ml-auto'>{post.time}</span>
            </div>
            <p className='text-sm text-foreground mt-2 leading-relaxed'>{post.content}</p>
            <div className='flex items-center gap-4 mt-3 pt-3 border-t border-border'>
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  liked ? 'text-danger' : 'text-muted-foreground hover:text-danger'
                }`}
              >
                <Heart size={14} className={liked ? 'fill-current' : ''} />
                {post.likes + (liked ? 1 : 0)}
              </button>
              <button className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors'>
                <MessageSquare size={14} />
                {post.comments}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { institution } = useInstitutionStore();
  const { posts, loading } = useFeed(institution?.alias ?? '');
  const [postContent, setPostContent] = useState('');

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-4'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Feed de Notícias</h1>
        <p className='text-sm text-muted-foreground mt-1'>Fique por dentro das novidades da escola.</p>
      </div>

      {/* Create post */}
      <Card>
        <CardContent className='p-4 space-y-3'>
          <Textarea
            placeholder='Compartilhe um aviso, material ou novidade...'
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            className='min-h-[80px]'
          />
          <div className='flex items-center justify-between'>
            <div className='flex gap-1'>
              <button className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
                <ImageIcon size={16} />
              </button>
              <button className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
                <Paperclip size={16} />
              </button>
            </div>
            <button
              type='button'
              disabled={!postContent.trim()}
              className='flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              <Send size={14} /> Publicar
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}><CardContent className='p-4'><Skeleton className='h-20 w-full' /></CardContent></Card>
        ))
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
