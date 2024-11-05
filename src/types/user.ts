export interface Client {
  _id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  coverImg: string;
  coverImgId: string;
  profileImgId: string;
  followers: [];
  following: [];
  profileImg: string;
  bio?: string;
  googleId: string;
  _v: number;
}
