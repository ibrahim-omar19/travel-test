import axios from 'axios';
import { AuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

export const revalidate = 0;

const travolicAxios = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL
  baseURL: 'https://api.travolic.site',
});

const authorize = async (
  credentials: Record<string, string> | undefined
) => {
  if (!credentials) return null;

  const { email, password } = credentials as {
    email: string;
    password: string;
  };

  try {
    const { data } = await travolicAxios.post('/auth/login', {
      email,
      password,
    });

    if (data.status === 'success') {
      return {
        ...data.payload,
        token: data.token,
        provider: 'credentials',
      };
    } else {
      throw new Error(data?.message || 'Something went wrong');
    }
  } catch (err: any) {
    if (err?.response?.data?.message) {
      throw new Error(err?.response?.data?.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const authOptions: AuthOptions = {
  pages: {
    signOut: '/',
    error: '/',
  },

  secret:
    process.env.NEXTAUTH_SECRET ||
    'uIoSX+apnsd2xJFnVZwPTG8oeghM3QGkJTiopky3jG0',

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 24 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account?.provider === 'google') {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.apiResponse = account.apiResponse;
      }

      if (account?.provider === 'facebook') {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.access_token = account.access_token;
        token.apiResponse = account.apiResponse;
      }

      user && (token.user = user);
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (!token) {
        throw new Error('Session token is missing or invalid');
      }

      if (currentTime > token.exp) {
        throw new Error('Token has expired');
      }

      if (token?.provider === 'google') {
        delete token.user;
        session.user = { ...token };
        return session;
      }

      if (token?.provider === 'facebook') {
        delete token?.user;
        session.user = { ...token };
        return session;
      }

      //  credentials provider
      delete token?.email;
      session = { ...token };
      return session;
    },

    signIn: async ({ account, profile }) => {
      if (account?.provider === 'google') {
        if (!profile?.email_verified) {
          throw new Error('Email is not verified');
        }

        try {
          const { data } = await travolicAxios.post(
            '/auth/login-google',
            {
              tokenId: account.id_token,
            }
          );
          account.apiResponse = data.payload;

          return true;
        } catch (err) {
          throw new Error(
            'Error in google signIn callback',
            err as any
          );
        }
      } else if (account?.provider === 'facebook') {
        try {
          const { data } = await travolicAxios.post(
            '/auth/login-facebook',
            {
              accessToken: account.access_token,
              userId: account.providerAccountId,
            }
          );
          account.apiResponse = data;
          return true;
        } catch (err) {
          throw new Error(
            'Error in google signIn callback',
            err as any
          );
        }
      }

      return true; // Default return for other providers or cases
    },
  },
};
