import { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, ArrowRight, ChevronDown, ChevronUp, Briefcase, PenTool, Building, Mic, Megaphone, GraduationCap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import { privacyPolicy } from "./content/privacy";
import { termsOfService } from "./content/terms";

function App() {

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [strength, setStrength] = useState<'Light' | 'Medium' | 'Strong'>('Medium');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [popup, setPopup] = useState<"privacy" | "terms" | null>(null);


  const [openFaq, setOpenFaq] = useState<number | null>(null);


  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackHoneypot, setFeedbackHoneypot] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const countWords = (text: string) =>
    text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleHumanise = async () => {

    if (!inputText.trim()) {
      setError('Please enter some text to humanise.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);

    

    let stepDelay = 600;

    if (countWords(inputText) > 150) {
      stepDelay = 1200;
    }

    setTimeout(() => setProcessingStep(1), stepDelay);
    setTimeout(() => setProcessingStep(2), stepDelay * 2);
    setTimeout(() => setProcessingStep(3), stepDelay * 3);

    setError(null);



    try {

      const cleanText = DOMPurify.sanitize(inputText);

      const response = await fetch(
        "https://vanish-ai-backend.onrender.com/api/humanise",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process text');
      }


      let processingDelay = 2000;

      if (countWords(inputText) > 150) {
        processingDelay = 3500;
      }

      await new Promise(resolve => setTimeout(resolve, processingDelay));

      setOutputText(data.result);


    } catch (err: any) {

      setError(err.message || 'Unexpected error');

    } finally {

      setIsProcessing(false);

    }
  };

  const handleCopy = () => {
    if (!outputText) return;

    navigator.clipboard.writeText(outputText);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {

    e.preventDefault();


    if (feedbackHoneypot.trim()) {
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 5000);
      return;
    }

    const cleanName = DOMPurify.sanitize(feedbackName);
    const cleanMessage = DOMPurify.sanitize(feedbackMessage);

    if (cleanName.trim() && cleanMessage.trim()) {

      setFeedbackSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
      setFeedbackHoneypot('');

      setTimeout(() => setFeedbackSubmitted(false), 5000);
    }
  };

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    id: string
  ) => {

    e.preventDefault();
    setIsMobileMenuOpen(false);

    const section = document.getElementById(id);
    const header = document.querySelector("header");

    if (!section || !header) return;

    const headerHeight = header.offsetHeight;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;

    let offset = 70;

    if (id === "tool") offset = 1;
    if (id === "faq") offset = 20;
    if (id === "feedback") offset = 60;

    window.scrollTo({
      top: sectionTop - headerHeight - offset,
      behavior: "smooth",
    });
  };

  const processingMessages = [
    "Analyzing text...",
    "Breaking AI patterns...",
    "Neutralizing signals...",
    "Finalizing output..."
  ];

  return (

<div className="min-h-screen bg-background text-gray-100 font-sans overflow-x-hidden">

<header className="fixed top-0 w-full z-50 glass border-b border-white/10">

<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

<div className="flex items-center gap-2">

<img src="/logo3.svg" className="w-12 h-12 sm:w-16 sm:h-16" />

<span className="font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
Vanish AI
</span>

</div>

<nav className="hidden lg:flex gap-6 text-sm font-medium text-gray-300">

<a href="#how-it-works" onClick={(e)=>scrollToSection(e,'how-it-works')} className="hover:text-white">How it Works</a>
<a href="#tool" onClick={(e)=>scrollToSection(e,'tool')} className="hover:text-white">Tool</a>
<a href="#faq" onClick={(e)=>scrollToSection(e,'faq')} className="hover:text-white">FAQ</a>
<a href="#feedback" onClick={(e)=>scrollToSection(e,'feedback')} className="hover:text-white">Feedback</a>

</nav>

</div>
</header>


{/* HERO */}

<section className="pt-32 pb-12 px-4">

<div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

{/* LEFT SIDE TEXT */}

<div className="text-center lg:text-left">

<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">

<span>No Rewrites. No Edits.</span>
<br/>
<span>Keep Every Word Exactly as Generated,</span>
<br/>
<span className="text-gradient">While AI Signals Disappear.</span>

</h1>

<p className="text-lg sm:text-xl text-gray-400 mb-6">

Welcome to the next generation AI humanizer. Vanish AI removes AI traces without changing your words.

</p>

<p className="text-sm text-gray-500 italic mb-8">

Inaugurated by <span className="text-gray-300 font-medium">Dr. Yamini Mithra, MBBS</span> on 16-03-2026

</p>

<button
onClick={(e)=>scrollToSection(e,'tool')}
className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full hover:scale-105">

Start Vanishing
<ArrowRight className="w-5 h-5"/>

</button>

</div>


{/* RIGHT SIDE PHOTO */}

<div className="flex justify-center lg:justify-end">

<div className="glass p-6 rounded-2xl border border-white/10 text-center max-w-xs">

<img
src="/yamini.jpg"
alt="Dr Yamini Mithra"
className="w-32 h-32 mx-auto rounded-full object-cover border border-white/20"
/>

<p className="mt-4 text-sm text-gray-400">Inaugurated by</p>

<p className="text-white font-semibold">Dr. Yamini Mithra, MBBS</p>

<p className="text-xs text-gray-500">16 March 2026</p>

</div>

</div>

</div>

</section>

</div>


  );
}


export default App;
