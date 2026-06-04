import { IHomeService } from './homeInterface';
import { Post } from '../models/postModel';

export class HomeService implements IHomeService {
  async getPosts(): Promise<Post[]> {
    const response = await fetch('/api/posts');
    return response.json();
  }
}
