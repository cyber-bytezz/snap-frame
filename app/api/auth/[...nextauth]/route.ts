import NextAuth, { Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/user";

interface CustomProfile extends Profile {
    picture: string;
}

interface customSession extends Session {
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
        })
    ],
    callbacks: {
        async session({ session }: { session: Session }) {
            const customSession = session as customSession;
            await connectToDatabase();

            // Find the user by email in MongoDB
            const sessionUser = await User.findOne({ email: customSession.user.email });

            // Add MongoDB user ID to the session object
            customSession.user.id = sessionUser._id.toString();

            return customSession;
        },
        async signIn({ profile }) {
            const customProfile = profile as CustomProfile;
            try {
                await connectToDatabase();

                // Check if user already exists in MongoDB
                const userExists = await User.findOne({ email: profile?.email });

                // If user doesn't exist, create a new user
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
    secret : process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
