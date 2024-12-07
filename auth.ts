import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write";
import { GITHUB_AUTHOR_QUERY, GOOGLE_AUTHOR_QUERY } from "./lib/query";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "github" && profile) {
          const existingUser = await client.fetch(GITHUB_AUTHOR_QUERY, {
            id: profile.id?.toString(),
          });
          if (!existingUser) {
            await writeClient.create({
              _type: "author",
              _id: profile.id?.toString(),
              id: profile.id?.toString(),
              name: user?.name,
              username: profile?.login || "",
              email: user?.email,
              image: user?.image,
              bio: profile?.bio || "",
            });
          }
        } else if (account?.provider === "google" && profile) {
          const existingUser = await client.fetch(GOOGLE_AUTHOR_QUERY, {
            id: profile.sub,
          });
          if (!existingUser) {
            await writeClient.create({
              _type: "author",
              _id: profile.sub,
              id: profile.sub,
              name: user?.name,
              email: user?.email,
              image: user?.image,
              bio: "",
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      try {
        if (account?.provider === "github" && profile) {
          token.id = profile.id?.toString();
        } else if (account?.provider === "google" && profile) {
          token.id = profile.sub;
        }

        if (token.id) {
          const query =
            account?.provider === "google"
              ? GOOGLE_AUTHOR_QUERY
              : GITHUB_AUTHOR_QUERY;
          const sanityUser = await client.fetch(query, { id: token.id });
          if (sanityUser) {
            token.id = sanityUser._id || sanityUser.id;
          }
        }
      } catch (error) {
        console.error("JWT error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id.toString();
      }
      return session;
    },
  },
  debug: true,
});
