export const metadata = {
  title: 'Admin | Sarkitshala',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="max-w-6xl mx-auto px-3 pt-24 pb-16">{children}</div>;
}