import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';
import ScrollPolish from '@/components/ScrollPolish';
const url=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata={
 metadataBase:new URL(url),title:{default:'Saloni Nathani — AI, Data & Software',template:'%s | Saloni Nathani'},
 description:'Saloni Nathani — Data analytics, AI, machine learning, software engineering and published research. Pace University gold medal and Scholar Award.',
 openGraph:{type:'website',title:'Saloni Nathani — AI, Data & Software',description:'Explore projects, publications, career experience, and skills in AI, analytics and software engineering.'},
 icons:{icon:`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg`}, robots:{index:true,follow:true}
};
export default function RootLayout({children}){return <html lang="en"><body><Providers><ScrollPolish/><Cursor/><div id="top"/><Navbar/>{children}<Footer/></Providers></body></html>}
