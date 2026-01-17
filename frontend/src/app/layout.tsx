import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import WavyBackground from '@/components/UI/WavyBackground/WavyBackground';
import { RealtimeProvider } from '@/context/RealtimeContext';
import styles from '@/styles/layout.module.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LuminaChain | Real-Time Blockchain Intelligence',
  description: 'Advanced real-time blockchain indexing and analytics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RealtimeProvider>
          <WavyBackground />
          <div className={styles.appShell}>
            <Sidebar />
            <div className={styles.mainContent}>
              <Header />
              <main className={styles.pageContainer}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </RealtimeProvider>
      </body>
    </html>
  );
}
