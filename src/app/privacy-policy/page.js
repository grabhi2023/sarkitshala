export const metadata = {
  title: 'Privacy Policy | Sarkitshala',
  description:
    'Learn how Sarkitshala.com collects, uses, and protects your data while providing free, hands-on tutorials in circuits, IoT, robotics, and technology education.',
  keywords: [
    'Privacy Policy',
    'Sarkitshala',
    'Free tutorials',
    'IoT',
    'Robotics',
    'Tech learning',
    'Educational platform',
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Privacy Policy | Sarkitshala',
    description:
      'Sarkitshala is committed to protecting your privacy while offering free, hands-on learning in circuits, IoT, and robotics.',
    url: 'https://sarkitshala.com/privacy-policy',
    siteName: 'Sarkitshala',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Sarkitshala',
    description:
      'Understand how Sarkitshala handles user data while offering free tutorials in circuits, IoT, and more.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="articleContainer md:w-[80%] mt-20 md:ml-[100px]">
      <div className="shadow-md rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-200 mb-6 border-b pb-4">
          Privacy Policy
        </h1>

        <p className="text-lg mb-6">
          At <span className="font-semibold">Sarkitshala.com</span>, we are committed to
          protecting your privacy while providing open-access educational content in technology,
          IoT, robotics, and beyond.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-base leading-relaxed">
            We may collect minimal information like your name, email (if voluntarily submitted),
            and any feedback you choose to share with us. We do not require account registration
            to access our content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li>To improve user experience on our platform</li>
            <li>To respond to queries or feedback</li>
            <li>To send occasional updates (only if you opt in)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
          <p className="text-base leading-relaxed">
            We may use third-party analytics tools like Google Analytics to understand user
            behavior. These services may collect anonymized information through cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Data Sharing & Security</h2>
          <p className="text-base leading-relaxed">
            We do not sell or share your personal data with any third party. All collected data is
            kept secure and only used for internal improvement purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p className="text-base leading-relaxed">
            You have the right to access, correct, or request deletion of your personal information
            by contacting us directly at{' '}
            <a href="mailto:support@sarkitshala.com" className="text-blue-600 hover:underline">
              support@sarkitshala.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Updates to This Policy</h2>
          <p className="text-base leading-relaxed">
            This Privacy Policy may be updated from time to time. We recommend checking this page
            periodically to stay informed about how we protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-base leading-relaxed">
            For any privacy-related concerns, please contact us at:{' '}
            <a href="mailto:support@sarkitshala.com" className="text-blue-600 hover:underline">
              support@sarkitshala.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
