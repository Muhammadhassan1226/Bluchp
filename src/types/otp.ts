export interface OTP {
  _id: string;
  verified: boolean;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  __v: number;
}
