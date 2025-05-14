import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";
import type { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import DemoUser from "@/models/DemoUser";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@professor.ai';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_ID = '000000000000000000000000';

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'student';
    subscription: 'free' | 'pro' | 'enterprise';
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectDB();

        // Check for admin login
        if (credentials.email === ADMIN_EMAIL) {
          if (credentials.password === ADMIN_PASSWORD) {
            return {
              id: ADMIN_ID,
              email: ADMIN_EMAIL,
              name: 'Admin',
              role: 'admin',
              subscription: 'enterprise'
            };
          }
          throw new Error('Invalid admin credentials');
        }

        // Check for demo user first
        if (credentials.email.startsWith('demo_')) {
          console.log('Demo login attempt:', {
            email: credentials.email,
            attemptedPassword: credentials.password
          });

          // First find without expiry check
          const demoUser = await DemoUser.findOne({ email: credentials.email });
          console.log('Found demo user (without expiry check):', {
            exists: !!demoUser,
            email: demoUser?.email,
            password: demoUser?.password,
            expiresAt: demoUser?.expiresAt
          });

          // Then check expiry
          if (demoUser) {
            const isExpired = demoUser.expiresAt < new Date();
            console.log('Demo expiry check:', {
              expiresAt: demoUser.expiresAt,
              now: new Date(),
              isExpired
            });

            if (!isExpired && demoUser.password === credentials.password) {
              return {
                id: demoUser._id.toString(),
                email: demoUser.email,
                name: 'Demo Admin',
                role: 'admin',
                subscription: 'enterprise',
                isDemo: true
              };
            }
            throw new Error(isExpired ? 'Demo account expired' : 'Invalid password');
          }
          throw new Error('Demo account not found');
        }

        // Then check regular user
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('Email not registered');
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: 'student',
          subscription: user.subscription,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Use the ID directly
        token.role = user.role as 'admin' | 'student';
        token.subscription = user.subscription as 'free' | 'pro' | 'enterprise';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Now this will be a valid ObjectId string
        session.user.role = token.role as 'admin' | 'student';
        session.user.subscription = token.subscription as 'free' | 'pro' | 'enterprise';
      }
      return session as CustomSession;
    }
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 