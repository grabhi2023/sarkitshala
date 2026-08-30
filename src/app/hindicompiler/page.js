
export const metadata = {
  title: "Hindi Programming Language Interpreter - Run Hindi Code Online",
  description:
    "Execute Hindi programming language code online using our custom Hindi interpreter. Learn coding in Hindi with real-time output – created by Sarkitshala.",
  alternates: {
    canonical: "https://sarkitshala.com/hindicompiler",
  },
 
  twitter: {
    card: "summary_large_image",
   
  },
};

export default function Page() {
  return (
    <div className="min-h-screen  dark:text-white text-black mt-32 md:mt-[90px] px-4">
      <h1 className="text-2xl md:text-3xl  font-bold text-center mb-4">
        Run Hindi Code Online - हिंदी प्रोग्रामिंग इंटरप्रेटर
      </h1>
      <p className="text-center  mb-6">
        Sarkitshala presents an online platform to write and execute code in the Hindi language. Start coding in your mother tongue!
      </p>

      <div className="w-full h-[80vh]">
        <iframe
          src="https://hindicoding.netlify.app/"
          className="w-full h-full border-0 rounded"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

