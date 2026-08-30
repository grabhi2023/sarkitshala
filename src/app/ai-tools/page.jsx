"use client";

import { useMemo, useState } from "react";


const pricingOptions = ["All", "Free", "Freemium", "Paid"];


const aiTools = [
  {
    "name": "Google Gemini",
    "description": "Google's advanced AI chatbot for writing, coding, learning, and more.",
    url: "https://gemini.google.com/",
    category: "Chatbot / Assistant",
    pricing: "Freemium",
  },
  {
    name: "ChatGPT",
    description: "Chat with an intelligent assistant, ideal for coding, writing, and learning.",
    url: "https://chat.openai.com",
    category: "Chatbot / Assistant",
    pricing: "Freemium",
  },
  {
    name: "Midjourney",
    description: "Create beautiful AI-generated images through text prompts on Discord.",
    url: "https://www.midjourney.com",
    category: "Image Generation",
    pricing: "Paid",
  },
  {
    name: "Runway ML",
    description: "Generate videos, remove backgrounds, or apply AI effects on footage.",
    url: "https://runwayml.com",
    category: "Video Editing / Creation",
    pricing: "Freemium",
  },
  {
    name: "Suno AI",
    description: "Generate complete music just from text — lyrics, vocals, and instruments.",
    url: "https://suno.com",
    category: "Music / Audio",
    pricing: "Freemium",
  },
  {
    name: "Leonardo AI",
    description: "Generate concept art, 3D assets, and illustrations using AI.",
    url: "https://app.leonardo.ai",
    category: "Image Generation",
    pricing: "Freemium",
  },
  {
    name: "Perplexity AI",
    description: "AI-powered search engine with sources — ideal for learning and research.",
    url: "https://www.perplexity.ai",
    category: "Research",
    pricing: "Free",
  },
  {
    name: "Durable AI",
    description: "AI website builder — enter your business idea, and get a complete site.",
    url: "https://durable.co",
    category: "Website Builder",
    pricing: "Freemium",
  },
  {
    name: "Krea AI",
    description: "Real-time design assistant that creates and enhances images with AI.",
    url: "https://krea.ai",
    category: "Image Generation",
    pricing: "Freemium",
  },
  {
    name: "Pika Labs",
    description: "Create short animated videos with text prompts — fast and easy.",
    url: "https://www.pika.art",
    category: "Video Editing / Creation",
    pricing: "Freemium",
  },
  {
    name: "Copy.ai",
    description: "Write marketing copy, blogs, emails, and ads with smart AI assistance.",
    url: "https://www.copy.ai",
    category: "Writing / Content",
    pricing: "Freemium",
  },
  {
    name: "Writesonic",
    description: "Create articles, social media posts, and SEO content in minutes.",
    url: "https://writesonic.com",
    category: "Writing / Content",
    pricing: "Freemium",
  },
  {
    name: "Tome",
    description: "Create AI-generated storytelling and slide presentations easily.",
    url: "https://tome.app",
    category: "Presentation / Docs",
    pricing: "Freemium",
  },
  {
    name: "Notion AI",
    description: "Write, summarize, and brainstorm right inside Notion documents.",
    url: "https://www.notion.so/product/ai",
    category: "Productivity",
    pricing: "Paid",
  },
  {
    name: "Adobe Firefly",
    description: "Generate text effects, images, and templates for creative work.",
    url: "https://firefly.adobe.com",
    category: "Image Generation",
    pricing: "Freemium",
  },
  {
    name: "Remove.bg",
    description: "Remove image backgrounds automatically with AI.",
    url: "https://www.remove.bg",
    category: "Image Editing",
    pricing: "Freemium",
  },
  {
    name: "D-ID",
    description: "Turn photos into talking avatars or AI presenters.",
    url: "https://www.d-id.com",
    category: "Video Editing / Creation",
    pricing: "Paid",
  },
  {
    name: "DeepSeek",
    description: "Chatbot focused on reading documents, summarizing, and technical coding help.",
    url: "https://chat.deepseek.com/",
    category: "Chatbot / Assistant",
    pricing: "Free",
  },
  {
    name: "Answer.ai",
    description: "Answers  Questions by Selecting.",
    url: "https://chat.deepseek.com/",
    category: "Chatbot / Assistant",
    pricing: "Free",
  },
     {
    name: "Illusion Image Creator",
    description: "Unknown",
    url: "Unknown",
    category: "Image Generation",
    pricing: "Unknown"
  },
  {
    name: "Vectorizer.ai",
    description: "Vector Image Create",
    url: "https://www.vectorizer.ai",
    category: "Image Editing",
    pricing: "Unknown"
  },
  {
    name: "Kits.ai",
    description: "Add any Instrument",
    url: "https://www.kits.ai",
    category: "Music / Audio",
    pricing: "Unknown"
  },
  {
    name: "Getvois.com",
    description: "Replace your voice song to any other",
    url: "https://www.getvois.com",
    category: "Voice AI / Music",
    pricing: "Unknown"
  },
  {
    name: "Reface.ai",
    description: "Change face from any video",
    url: "https://reface.ai",
    category: "Video Editing / Face Swap",
    pricing: "Freemium"
  },
  {
    name: "Dj.studio",
    description: "Customize your songs",
    url: "https://dj.studio",
    category: "Music / DJ Mixing",
    pricing: "Unknown"
  },
  {
    name: "Luma.AI",
    description: "Customise any image into a drone shot",
    url: "https://lumalabs.ai",
    category: "3D / Image Generation",
    pricing: "Unknown"
  },
  {
    name: "Imagica.ai",
    description: "For app",
    url: "https://www.imagica.ai",
    category: "App Builder / UI",
    pricing: "Unknown"
  },
  {
    name: "Kriya.ai",
    description: "Editing pictures",
    url: "https://kriya.ai",
    category: "Image Editing",
    pricing: "Unknown"
  },
  {
    name: "Visme",
    description: "For making animated login page",
    url: "https://www.visme.co",
    category: "Design / Animation",
    pricing: "Freemium"
  },
  {
    "name": "Devin AI",
    "description": "To solve any problem",
    "url": "https://preview.devin.ai/",
    "category": "AI Coding Assistant",
    "pricing": "Unknown"
  },
  {
    "name": "AdGuard Family",
    "description": "Banned all 18+ sites",
    "url": "https://family.adguard-dns.com",
    "category": "Parental Control / DNS",
    "pricing": "Free"
  },
  {
    "name": "Universe.io",
    "description": "HTML/CSS buttons (Full Code)",
    "url": "https://www.universe.io",
    "category": "Web Dev Tools",
    "pricing": "Free"
  },
  {
    "name": "Uiball.com",
    "description": "Free loaders",
    "url": "https://www.uiball.com",
    "category": "Web Dev / UI",
    "pricing": "Free"
  },
  {
    "name": "Dora.run",
    "description": "Create Websites using prompts",
    "url": "https://www.dora.run",
    "category": "No-Code / AI Builder",
    "pricing": "Unknown"
  }

,
  
  {
    "name": "Logodiffusion",
    "description": "To create logo",
    "url": "https://www.logodiffusion.com",
    "category": "Logo Design",
    "pricing": "Unknown"
  },
  {
    "name": "Flash Museum",
    "description": "To discover flash games",
    "url": "https://flashmuseum.org",
    "category": "Games / Archive",
    "pricing": "Free"
  },
  {
    "name": "Kittl.com",
    "description": "For creating logo",
    "url": "https://www.kittl.com",
    "category": "Logo Design / Graphics",
    "pricing": "Freemium"
  },
  {
    "name": "Predis.ai",
    "description": "Prompt to post",
    "url": "https://www.predis.ai",
    "category": "Social Media / AI Content",
    "pricing": "Freemium"
  },
  {
    "name": "Ui-snippets.dev",
    "description": "Animation for websites",
    "url": "https://ui-snippets.dev",
    "category": "Web Dev / UI Animation",
    "pricing": "Free"
  },
  {
    "name": "Nswr.ai",
    "description": "Comment using AI",
    "url": "https://nswr.ai",
    "category": "AI Tools / Social",
    "pricing": "Unknown"
  },




  
  {
    "name": "Letsenhance.io",
    "description": "Image enhancer & upscaler",
    "url": "https://letsenhance.io",
    "category": "Image Editing / AI",
    "pricing": "Freemium"
  },
  {
    "name": "Pixcam.com",
    "description": "For 3D icons for webdev",
    "url": "https://pixcam.com",
    "category": "Web Dev / 3D Icons",
    "pricing": "Unknown"
  },
  {
    "name": "Openui.fly.dev",
    "description": "Image to code",
    "url": "https://openui.fly.dev",
    "category": "AI Dev Tools",
    "pricing": "Free"
  },
  {
    "name": "Lumalabs.ai",
    "description": "Image to video with prompts",
    "url": "https://lumalabs.ai",
    "category": "Video Generation",
    "pricing": "Unknown"
  },
  {
    "name": "Answer.ai",
    "description": "Answers questions by selecting",
    "url": "https://answer.ai",
    "category": "QnA / AI Assistant",
    "pricing": "Unknown"
  },
  {
    "name": "Gentype",
    "description": "Make an alphabet out of anything",
    "url": "https://gentype.xyz",
    "category": "Typography / AI Design",
    "pricing": "Unknown"
  },
  {
    "name": "Perplexity",
    "description": "AI tool for research work",
    "url": "https://www.perplexity.ai",
    "category": "Research / AI Assistant",
    "pricing": "Free"
  },
  {
    "name": "Typeset.io",
    "description": "For writing Literature review",
    "url": "https://typeset.io",
    "category": "Research / Academic Writing",
    "pricing": "Freemium"
  },
  {
    "name": "Mindgrasp.ai",
    "description": "Helps in writing research papers",
    "url": "https://mindgrasp.ai",
    "category": "Academic Writing / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Elicit.com",
    "description": "For writing limitations in research paper",
    "url": "https://elicit.com",
    "category": "Research / Literature Review",
    "pricing": "Free"
  },
  {
    "name": "AgentGPT",
    "description": "For research paper",
    "url": "https://agentgpt.reworkd.ai",
    "category": "Autonomous AI / Research",
    "pricing": "Free"
  }

,
 
  {
    "name": "AiXploria",
    "description": "For different types of AI",
    "url": "https://aixploria.com",
    "category": "AI Tools",
    "pricing": "Unknown"
  },
  {
    "name": "overapi.com",
    "description": "Cheatsheet for all languages",
    "url": "https://overapi.com",
    "category": "Programming Reference",
    "pricing": "Free"
  },
  {
    "name": "Codeconvert.ai",
    "description": "Convert code from one language to another",
    "url": "https://codeconvert.ai",
    "category": "Dev Tools / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Sejda.com",
    "description": "Edit your PDF",
    "url": "https://www.sejda.com",
    "category": "PDF Tools",
    "pricing": "Freemium"
  },
  {
    "name": "askyourpdf.com",
    "description": "Ask anything to your PDF",
    "url": "https://askyourpdf.com",
    "category": "AI PDF Assistant",
    "pricing": "Free + Paid"
  },
  {
    "name": "Google Drive Folder",
    "description": "Stuff for video editing",
    "url": "https://drive.google.com/drive/mobile/folders/1w1s7dyddloz8u2ASvbxYvXhGHnbxXKhJ",
    "category": "Video Assets",
    "pricing": "Free"
  },
  {
    "name": "Treeknowledge.org",
    "description": "Finds all answers",
    "url": "https://treeknowledge.org",
    "category": "Search / Q&A AI",
    "pricing": "Unknown"
  },
  {
    "name": "Lensgo.ai",
    "description": "Creating 3D videos",
    "url": "https://lensgo.ai",
    "category": "Video / 3D AI",
    "pricing": "Unknown"
  },
  {
    "name": "Pythagora.ai",
    "description": "For building website",
    "url": "https://pythagora.ai",
    "category": "No-Code / Website Builder",
    "pricing": "Unknown"
  },
  {
    "name": "Vocalremover.org",
    "description": "Separate voice from music",
    "url": "https://vocalremover.org",
    "category": "Audio Tools",
    "pricing": "Free"
  },
  {
    "name": "Filrecr.com",
    "description": "Free download macOS, Windows, Android software",
    "url": "https://filrecr.com",
    "category": "Software Download",
    "pricing": "Free"
  },
  {
    "name": "Paperpanda.app",
    "description": "Access millions of research paper",
    "url": "https://paperpanda.app",
    "category": "Research Tools",
    "pricing": "Free"
  },
  {
    "name": "Pdf.ai",
    "description": "Upload your PDF and ask questions",
    "url": "https://pdf.ai",
    "category": "PDF AI Assistant",
    "pricing": "Unknown"
  },
  {
    "name": "Ifixit.com",
    "description": "Free repair guides for everything",
    "url": "https://ifixit.com",
    "category": "Repair / DIY Guides",
    "pricing": "Free"
  },
  {
    "name": "Widecanvas.ai",
    "description": "Code",
    "url": "https://widecanvas.ai",
    "category": "Dev Tools / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Napkin.ai",
    "description": "Generate illustration",
    "url": "https://napkin.ai",
    "category": "Image Generation / AI Design",
    "pricing": "Unknown"
  },
  {
    "name": "Speechma",
    "description": "Generates Hindi voice",
    "url": "https://speechma.com",
    "category": "Text-to-Speech / Hindi Voice",
    "pricing": "Unknown"
  },
  {
    "name": "Kompas.ai",
    "description": "Researches on AI tools",
    "url": "https://kompas.ai",
    "category": "AI Directory / Research",
    "pricing": "Unknown"
  },
  {
    "name": "Invideo",
    "description": "Create your own video using prompt",
    "url": "https://invideo.io",
    "category": "Video Generation / AI",
    "pricing": "Freemium"
  },
  {
    "name": "Magic.chengufeng.xyz",
    "description": "Change anything in the picture",
    "url": "https://magic.chengufeng.xyz",
    "category": "Image Editing / AI",
    "pricing": "Unknown"
  },
  {
    "name": "socialsonic.com",
    "description": "Create posts for LinkedIn",
    "url": "https://socialsonic.com",
    "category": "Social Media / AI Content",
    "pricing": "Unknown"
  },
  {
    "name": "writesonic.com",
    "description": "Writes article better than ChatGPT",
    "url": "https://writesonic.com",
    "category": "Content Writing / AI",
    "pricing": "Freemium"
  },
  {
    "name": "Bigtesm.ai",
    "description": "Creates website",
    "url": "https://bigtesm.ai",
    "category": "No-Code Website Builder",
    "pricing": "Unknown"
  },
  {
    "name": "10web.io",
    "description": "Creates website with zero coding",
    "url": "https://10web.io",
    "category": "Website Builder / AI",
    "pricing": "Freemium"
  },
  {
    "name": "graphy.app",
    "description": "Draws graph, charts for you",
    "url": "https://graphy.app",
    "category": "Chart / Data Visualization",
    "pricing": "Free"
  },
  {
    "name": "Wondershare",
    "description": "Helps in making product video",
    "url": "https://wondershare.com",
    "category": "Video Editing",
    "pricing": "Paid"
  },


  {
    "name": "Vidalgo.tech",
    "description": "Prompt to video in seconds",
    "url": "https://vidalgo.tech",
    "category": "Video Generation / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Cleanup.pictures",
    "description": "Removes anything selected",
    "url": "https://cleanup.pictures",
    "category": "Image Editing / AI",
    "pricing": "Free + Paid"
  },
  {
    "name": "Slideteam.net",
    "description": "Create your presentation",
    "url": "https://www.slideteam.net",
    "category": "Presentation Tools",
    "pricing": "Freemium"
  },
  {
    "name": "Bolt.new",
    "description": "Create a 3D website / develops a web app",
    "url": "https://bolt.new",
    "category": "No-Code / Web Builder",
    "pricing": "Unknown"
  },
  {
    "name": "Speakandimprove.com",
    "description": "Improve your English",
    "url": "https://speakandimprove.com",
    "category": "Language Learning / AI",
    "pricing": "Free"
  },
  {
    "name": "Namesnack.com",
    "description": "Suggest a name for your business",
    "url": "https://www.namesnack.com",
    "category": "Branding / Name Generator",
    "pricing": "Free"
  },
  {
    "name": "Stocking.ai",
    "description": "Generates logo",
    "url": "https://stocking.ai",
    "category": "Logo Design / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Gitmind.com",
    "description": "Converts prompt into mind maps",
    "url": "https://gitmind.com",
    "category": "Mind Mapping / Productivity",
    "pricing": "Freemium"
  },
  {
    "name": "Bigteam",
    "description": "Prompt to website creation",
    "url": "https://bigteam.ai",
    "category": "Website Builder / AI",
    "pricing": "Unknown"
  },
  {
    "name": "Apon.ai",
    "description": "Create your own model",
    "url": "https://apon.ai",
    "category": "AI Model Builder",
    "pricing": "Unknown"
  },
  {
    "name": "Insmind.com",
    "description": "Removes any object from the picture",
    "url": "https://insmind.com",
    "category": "Image Editing / AI",
    "pricing": "Unknown"
  },
  {
    name: "Plusdocs.com",
    description: "Generate a presentation or document",
    url: "https://plusdocs.com",
    category: "Productivity / AI Documents",
    pricing: "Unknown"
  },
  {
    name: "Abacus.ai",
    description: "Prompt to video / more model",
    url: "https://abacus.ai",
    category: "AI Tools / ML Models",
    pricing: "Freemium"
  },
  {
    name: "Zarla.com",
    description: "Create your website by form filling",
    url: "https://www.zarla.com",
    category: "No-Code Website Builder",
    pricing: "Unknown"
  },
  {
    name: "Edraw.ai",
    description: "Prompt to generate mind map",
    url: "https://edraw.ai",
    category: "Mind Mapping / AI",
    pricing: "Unknown"
  },
  {
    name: "Chatgpttoolbox",
    description: "Chrome extension for GPT history",
    url: "https://chatgpttoolbox.com",
    category: "Chrome Extension / Productivity",
    pricing: "Free"
  },
  {
    name: "Tunesnap.ai",
    description: "Image to song with lyrics",
    url: "https://tunesnap.ai",
    category: "Music / AI Creativity",
    pricing: "Unknown"
  },
  {
    name: "Startmycar",
    description: "Useful car repair guide",
    url: "https://startmycar.co.za",
    category: "DIY / Repair Guides",
    pricing: "Free"
  },
  {
    name: "Klap.com",
    description: "Converts a long video to many shorts",
    url: "https://klap.app",
    category: "Video Editing / AI",
  pricing: "Freemium"
  },
  {
    name: "Instableep",
    description: "Model will speak",
    url: "https://instableep.com",
    category: "Voice AI / TTS",
    pricing: "Unknown"
  },
  {
    name: "Clipshort.co",
    description: "Creates shorts video in seconds",
    url: "https://clipshort.co",
    category: "Video Creation / Shorts",
    pricing: "Unknown"
  }
,
  {
    name: "Midjourney",
    description: "Create beautiful AI-generated images through text prompts on Discord.",
    url: "https://www.midjourney.com",
    category: "Image Generation",
    pricing: "Paid"
  },
 




];








const groupByCategory = (tools) => {
  return tools.reduce((groups, tool) => {
    const cat = tool.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(tool);
    return groups;
  }, {});
};

const ToolCard = ({ tool }) => (
  <div className="group relative bg-[#1e293b]/40 border border-white/10 backdrop-blur-lg rounded-xl p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-blue-500 hover:shadow-blue-500/20">
    <div className="absolute top-3 right-3">
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
          tool.pricing === "Free"
            ? "bg-green-500 text-white"
            : tool.pricing === "Freemium"
            ? "bg-yellow-400 text-black"
            : tool.pricing === "Paid"
            ? "bg-red-500 text-white"
            : "bg-gray-500 text-white"
        }`}
      >
        {tool.pricing}
      </span>
    </div>
    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
      {tool.name}
    </h3>
    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{tool.description}</p>
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition"
    >
      Visit Tool
    </a>
  </div>
);

const AIToolGrid = () => {
  const [selectedPricing, setSelectedPricing] = useState("All");

  const categorizedTools = useMemo(() => {
    const filtered = aiTools.filter(
      (tool) => selectedPricing === "All" || tool.pricing === selectedPricing
    );
    return groupByCategory(filtered);
  }, [selectedPricing]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b] text-white px-6 py-20">
    
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
            Explore Top AI Tools
          </span>
        </h1>

        

        {Object.entries(categorizedTools).map(([category, tools]) => (
          <div key={category} className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded"></div>
              <h2 className="text-2xl font-semibold">{category}</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {tools.map((tool, index) => (
                <ToolCard key={tool.name + index} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIToolGrid;
