import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    _id?: string;
    isVerified?: boolean;
    isDeleted?: boolean;
    role?: string;
    avatarUrl?: string;
    mainAirport?: string;
    source?: string;
    access_token?: string;
    id_token?: string;
    sub?: string;
    provider?: string;
    providerAccountId?: string;
    expires_at?: number;
    apiResponse?: {
      _id: string;
      isVerified: boolean;
      isDeleted: boolean;
      role: string;
      email: string;
      password: string;
      avatarUrl: string;
      mainAirport: string;
      source: string;
      linkedAccounts: unknown;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    exp: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user?: User;
    accessToken?: string;
    expires?: string | number;
    error?: string;
  }

  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    email_verified?: boolean;
  }
}
