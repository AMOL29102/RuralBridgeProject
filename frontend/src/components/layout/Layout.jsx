import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-primary text-brand-text-primary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--brand-primary)',
            color: 'var(--brand-text-primary)',
            border: '1px solid var(--brand-border)',
          },
        }}
      />
    </div>
  );
};

export default Layout;
