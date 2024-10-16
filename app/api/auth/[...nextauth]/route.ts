import NextAuth, { Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/user";


interface CustomProfile extends Profile{
    picture : string
}

interface customSession extends Session{
    user : {
        email : string,
        name : string,
        id : string
    }
}
const handler = NextAuth({
    providers : [
        GoogleProvider({
            clientId :  process.env.GOOGLE_ID!,
            clientSecret : process.env.GOOGLE_SECRET!,
        })
    ],
    callbacks : {
        async session({session} : {session : Session}){ 
            const customSession = session as customSession;
            const sessionUser = await User.findOne({email : customSession?.user?.email});

            customSession.user.id = sessionUser._id.toString();
            return customSession;
        },
        async signIn({profile}) {
            const customProfile = profile as CustomProfile
            try{
            await connectToDatabase();
            const userExists = await User.findOne({email : profile?.email});
            if(!userExists){
                const user = await User.create({
                    email : customProfile?.email,
                    name : customProfile?.name,
                    image : customProfile?.picture,
                })
            }

            return true;

            }catch(error){
                console.log(error)
                return false;
            }
        }
    }
})

export {handler as GET,handler as POST}