import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">

        {/* Branding */}
        <div>
          <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Sarkitshala
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
            Learn Arduino, IoT, Embedded Systems and Robotics through
            practical tutorials and real-world experiments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/60 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/about", label: "About Us" },
              { href: "/privacy-policy", label: "Privacy Policy" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 flex items-center gap-1.5 group"
                >
                  <span className="inline-block w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-blue-500">›</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Updates */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/60 mb-4">
            Updates
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Stay connected with Sarkitshala to get the latest tutorials
            on Arduino, IoT, Raspberry Pi and Embedded Systems.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            Updated weekly
          </div>
        </div>

      </div>

      <div className="border-t border-border py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Sarkitshala — All Rights Reserved.</span>
        
      </div>
    </footer>
  );
};

export default Footer;