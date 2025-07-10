function Footer() {
  return (
    <footer className="w-full bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md shadow-glass mt-16 py-10 px-4 transition-all duration-300 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Anything Logo" className="h-10 w-10 drop-shadow-lg" />
          <span className="text-2xl font-extrabold tracking-tight text-primary">Anything</span>
        </div>
      
        <div className="text-gray-500 text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} Anything. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
