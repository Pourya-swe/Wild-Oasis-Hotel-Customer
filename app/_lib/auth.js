import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Note: pass in the current session which "auth" itself, and request
    authorized({ auth, request }) {
      // Note: We can do more advance authorization with "request" here.
      // Note: Nice trick to convert any value into boolean.
      return !!auth?.user;
    },
    // Note: It runs before the signUp process runs to check if the user actually exists in our supabase. It acts as a middleware to be precise. Also we can do many other operation here. We will do error error handling here.
    // Note: This callback gets passed in some informations.
    // Note: We need to return "true" if the user exists
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);
        //// If there is no use, we want to create a new user.
        if (!existingGuest) {
          await createGuest({ email: user.email, fullName: user.name });
        }
        return true;
      } catch {
        // Note: If the user doesn't exist - in the guest function -, we return false here.
        return false;
      }
    },
    // Note: We want the user "Id" from our supabase in a centeral place after the user has logged in, and it's gonna run after the signIn callback and each time that session is checkout basically. We access the session here and then we can add the guest id from our supabase to the session itself.
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      // Note: And here we can mutate the session object.
      // Todo: I dont know why I made this a number when encoutered a problem in resrvation page, take care of it later.
      session.user.guestId = +guest.id;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
