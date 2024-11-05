import { Client } from "./user";

export interface Post {
  client: Client;
  text?: string;
  media?: string;
  likes: [];
  _id: string;
  comments: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
