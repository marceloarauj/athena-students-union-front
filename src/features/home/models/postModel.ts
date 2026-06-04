export type Post = {
  id: number;
  author: string;
  role: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isImportant: boolean;
};
