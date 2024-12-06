import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { client } from "./sanity/lib/client"
import { writeClient } from "./sanity/lib/write"
import { GITHUB_AUTHOR_QUERY, GOOGLE_AUTHOR_QUERY } from "./lib/query"

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
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "github") {
          const existingUser = await client.withConfig({useCdn: false}).fetch(GITHUB_AUTHOR_QUERY, {
            id: profile?.id
          })

          if (!existingUser) {
            await writeClient.create({
              _type: 'author',
              id: profile?.id?.toString(),
              name: user?.name,
              username: profile?.login,
              email: user?.email,
              image: user?.image,
              bio: profile?.bio,
            })
          }
        }

        if (account?.provider === "google") {
          const existingUser = await client.fetch(GOOGLE_AUTHOR_QUERY, {
            email: user?.email
          })

          if (!existingUser) {
            await writeClient.create({
              _type: 'author',
              name: user?.name,
              email: user?.email,
              image: user?.image,
              id: user.id
            })
          }
        }

        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },

    async jwt({ token, account, profile, user }) {
      try {
        if (account?.provider === "github") {
          const sanityUser = await client.fetch(GITHUB_AUTHOR_QUERY, {
            id: profile?.id
          })
          if (sanityUser) {
            token.sanityId = sanityUser._id
          }
        }

        if (account?.provider === "google") {
          const sanityUser = await client.fetch(GOOGLE_AUTHOR_QUERY, {
            email: user?.email
          })
          if (sanityUser) {
            token.sanityId = sanityUser._id
          }
        }
      } catch (error) {
        console.error("JWT error:", error)
      }
      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sanityId as string
      }
      return session
    }
  },
  debug: true
})