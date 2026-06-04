import { Post } from '../models/postModel';
import { HomeMockService } from './homeMockService';
import { HomeService } from './homeService';
import { isMock } from '@/lib/serviceFactory';

export interface IHomeService {
  getPosts(): Promise<Post[]>;
}

export function getHomeService(institution: string): IHomeService {
  return isMock(institution) ? new HomeMockService() : new HomeService();
}
