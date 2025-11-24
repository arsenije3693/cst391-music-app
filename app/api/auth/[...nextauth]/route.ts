import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// IMPORTANT: no exported consts except GET and POST

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile?.email) token.email = profile.email;

      const admins = (process.env.ADMIN_EMAILS ?? "").split(",");
      token.role = admins.includes(token.email ?? "") ? "admin" : "user";

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});

// ONLY EXPORT THESE
export { handler as GET, handler as POST };
