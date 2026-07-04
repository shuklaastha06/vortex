import { AppProvider } from '@/context/AppContext';
import HeaderAndCart from '@/components/HeaderAndCart';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Vortex Commerce - Premium E-Commerce Experience',
  description: 'A transaction-safe, responsive e-commerce web application powered by Next.js, SQLite, Prisma, and Stripe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AppProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HeaderAndCart />
            
            <main style={{ flex: 1, padding: '40px 0' }}>
              {children}
            </main>
            
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
