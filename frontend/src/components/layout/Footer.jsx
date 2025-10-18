import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-primary mt-16 border-t border-brand-border">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-brand-accent">RuralBridge</h2>
          <p className="max-w-md mx-auto mt-2 text-brand-text-secondary">
            Connecting rural artisans and farmers with the world.
          </p>
          <div className="flex mt-4 space-x-6">
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
        <hr className="my-8 border-brand-border" />
        <div className="text-center text-brand-text-secondary">
          <p>&copy; {new Date().getFullYear()} RuralBridge. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
