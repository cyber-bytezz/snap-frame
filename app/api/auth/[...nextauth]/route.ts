import NextAuth, { Profile, Session } from "next-auth"; // Removed NextAuthUser
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/user";

// Extending Profile to include custom properties
interface CustomProfile extends Profile {
    picture: string;
}

// Extending Session to include user ID
interface CustomSession extends Session {
    user: {
        email: string;
        name: string;
        id: string;
    };
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session }: { session: Session }) {
            // Cast session to CustomSession type
            const customSession = session as CustomSession;

            try {
                // Connect to the database
                await connectToDatabase();

                // Find the user by email in MongoDB
                const sessionUser = await User.findOne({ email: customSession.user.email });

                if (sessionUser) {
                    // Add MongoDB user ID to the session object
                    customSession.user.id = sessionUser._id.toString();
                }

                return customSession; // Return the modified session object
            } catch (error) {
                console.error("Error in session callback:", error);
                // Return the original session even if there's an error
                return session;
            }
        },

        async signIn({ profile }) {
            const customProfile = profile as CustomProfile;

            try {
                // Connect to the database
                await connectToDatabase();

                // Check if the user already exists in MongoDB
                const userExists = await User.findOne({ email: customProfile?.email });

                // If the user doesn't exist, create a new user
                if (!userExists) {
                    await User.create({
                        email: customProfile?.email,
                        name: customProfile?.name,
                        image: customProfile?.picture,
                    });
                }

                return true; // Allow sign-in
            } catch (error) {
                console.error("Error during sign-in:", error);
                return false; // Deny sign-in in case of error
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
