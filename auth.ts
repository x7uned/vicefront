import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

interface DecodedUser {
  name?: string;
  email?: string;
  image?: string;
  id?: string;
  exp?: number;
  access_token?: string;
  admin: boolean;
  [key: string]: any;
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { email, password } = credentials;
          const res = await axios.post('http://localhost:4444/auth/login', { email, password });

          if (res.data.success && res.data.access_token) {
            return { ...res.data.user, access_token: res.data.access_token, admin: res.data.admin };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }: { user: DecodedUser; account: any; }) {
      if (account?.provider === 'google') {
        try {
          const fetchArray = {
            username: user.name || '',
            email: user.email || '',
            avatar: user.image || '',
            sub: user.id || '',
          };

          const response = await axios.post('http://localhost:4444/auth/oauth', fetchArray);

          if (response.data.success || response.data.access_token) {
            user.access_token = response.data.access_token;
            user.admin = response.data.admin;
            return true;
          } else {
            console.error('Backend sign-in failed:', response.data.message);
            return false;
          }
        } catch (error: any) {
          if (error.response && error.response.status === 409) {
            return true;
          } else if (error.response && error.response.status === 404) {
            return false;
          } else {
            console.error('Error sending user data to backend:', error);
            return false;
          }
        }
      } else if (account?.provider === 'credentials') {
        return true;
      }
      return false;
    },
    async session({ session, token }: { session: any; token: any; }) {
      if (token) {
        session.accessToken = token.access_token;

        try {
          const response = await axios.get('http://localhost:4444/auth/me', {
            headers: {
              Authorization: `Bearer ${token.access_token}`
            }
          });

          if (response.data.success) {
            const user = response.data.user;

            session.user.id = user.id;
            session.user.email = user.email;
            session.user.name = user.username;
            session.user.image = user.avatar;
            session.admin = response.data.admin;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          return null;
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any; }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.access_token = user.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(options);
