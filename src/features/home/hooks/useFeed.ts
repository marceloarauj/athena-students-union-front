'use client';

import { useEffect, useState } from 'react';
import { Post } from '../models/postModel';
import { getHomeService } from '../services/homeInterface';

export function useFeed(institution: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getHomeService(institution);
    service.getPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, [institution]);

  return { posts, loading };
}
