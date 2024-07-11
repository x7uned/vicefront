import axios from 'axios';
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

interface DecodedUser {
  name?: string;
  email?: string;
  image?: string;
  id?: string;
  exp?: number;
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
      async authorize(credentials, req) {
        const {email, password} = credentials;
        const res = await axios.post('http://localhost:4444/auth/login', {email, password});

        if (res.data.success && res.data.user) {
          return res.data.user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: DecodedUser, account: any, profile: any }) {

      if (account?.provider === 'google') {
        try {
          const fetchArray = {  
            username: user.name || '',
            email: user.email || '',
            avatar: user.image || '',
            sub: user.id || '',
          };

          const response = await axios.post('http://localhost:4444/auth/oauth', fetchArray);

          if (response.data.success) {
            user.id = response.data.id;
            return true;
          } else {
            console.error('Backend sign-in failed:', response.data.message);
            return false;
          }
        } catch (error: any) {
          if (error.response && error.response.status === 409) {
            return true;
          } else if (error.response && error.response.status === 404) {
            return false
          } else {
            console.error('Error sending user data to backend:', error);
            return false;
          }
        }
      } else if (account?.provider == "credentials") {
        return true;
      }
    },
    async session({ session, token }: { session: any, token: any }) {
      try {
        if (token) {

          const jsonObj = {
            id: token.id
          }

          const response = await axios.post('http://localhost:4444/auth/me', jsonObj);

          if (response.data.success) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.image = token.picture;
          } else {
            return null;
          }
        }
        return session;
      } catch (error) {
        console.log('error bra', error)
      }
    },
    async jwt({ token, user }: { token: any, user: any }) {

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.username;
        token.picture = user.avatar;
      }
      return token;
    },
  },
};

export default NextAuth(options);
