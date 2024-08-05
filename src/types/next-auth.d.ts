import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    admin: boolean;
    expires: string;
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    };
  }
}
