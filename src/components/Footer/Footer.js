import Link from "next/link";

const tutorialLinks = [
  { href: "/arduino", label: "Arduino" },
  { href: "/esp", label: "ESP32" },
  { href: "/raspberry", label: "Raspberry Pi" },
  { href: "/stm32", label: "STM32" },
  { href: "/jetson", label: "Jetson Nano" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-slate-600 transition-colors hover:text-blue-600 hover:underline dark:text-slate-400 dark:hover:text-blue-400"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="mb-3 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent dark:from-blue-400 dark:to-violet-400">
            Sarkitshala
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Learn Arduino, IoT, Embedded Systems and Robotics through practical tutorials and real-world experiments.
          </p>
        </div>

        <FooterLinks title="Tutorials" links={tutorialLinks} />
        <FooterLinks title="Company" links={companyLinks} />

        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Updates</h3>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Get the latest tutorials on Arduino, IoT, Raspberry Pi and Embedded Systems.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
            Updated weekly
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row md:px-6 lg:px-8">
          <span>&copy; {new Date().getFullYear()} Sarkitshala. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;