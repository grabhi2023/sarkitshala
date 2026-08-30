import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500 text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Not Found</h2>
        <p className="mb-4">Could not find requested resource</p>
        <Link href="/" className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200 transition">
          
            Return Home
          
        </Link>
      </div>
    </div>
  );
}
