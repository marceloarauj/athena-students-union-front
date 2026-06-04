import { IHomeService } from './homeInterface';
import { Post } from '../models/postModel';
import data from '@/seeds/feed_posts.json';

export class HomeMockService implements IHomeService {
  async getPosts(): Promise<Post[]> {
    return data as Post[];
  }
}
