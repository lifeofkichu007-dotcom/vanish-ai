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

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Feedback State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackHoneypot, setFeedbackHoneypot] = useState(''); // Spam honeypot
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleHumanise = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanise.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);

    const wordCount = countWords(inputText);

    // normal speed
    let stepDelay = 600;

    // slower if text is long
    if (wordCount > 150) {
      stepDelay = 1200;
    }

    setTimeout(() => setProcessingStep(1), stepDelay);
    setTimeout(() => setProcessingStep(2), stepDelay * 2);
    setTimeout(() => setProcessingStep(3), stepDelay * 3);

    setError(null);

    const apiUrl = 'https://vanish-ai-backend.onrender.com';

    try {
      // Sanitize input before sending to backend
      const cleanText = DOMPurify.sanitize(inputText);

      const response = await fetch(`${apiUrl}/api/humanise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, strength }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process text');
      }

      // simulate processing time (good for UX + future ads)
      const wordCount = countWords(inputText);

      let processingDelay = 2000;

      if (wordCount > 150) {
        processingDelay = 3500;
      }

      await new Promise(resolve => setTimeout(resolve, processingDelay));

setOutputText(data.result);

      setOutputText(data.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Silently block spam bots filling the honeypot
    if (feedbackHoneypot.trim()) {
        setFeedbackSubmitted(true);
        setTimeout(() => setFeedbackSubmitted(false), 5000);
        return;
    }

    const cleanName = DOMPurify.sanitize(feedbackName);
    const cleanMessage = DOMPurify.sanitize(feedbackMessage);

    if (cleanName.trim() && cleanMessage.trim()) {
      // In a real app we'd send these to the backend here
      setFeedbackSubmitted(true);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
      setFeedbackHoneypot('');
      setTimeout(() => setFeedbackSubmitted(false), 5000);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const section = document.getElementById(id);
    const header = document.querySelector('header');

    if (section && header) {
      const headerHeight = header.offsetHeight;
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      const offset = id === 'tool' ? 1 : 70;

      window.scrollTo({
        top: sectionTop - headerHeight - offset,
        behavior: 'smooth'
      });
    }
  };

  const faqs = [
    {
    question: "Does Vanish AI rewrite my text?",
    answer: "No. Vanish AI does not rewrite your content. It keeps your words the same and only removes AI detection patterns that AI detectors look for."
  },
  {
    question: "Will my original text change?",
    answer: "No. Your original text stays exactly the same. Vanish AI only removes hidden AI signals so the content looks more natural."
  },
  {
    question: "How does Vanish AI remove AI detection?",
    answer: "Vanish AI analyzes AI generated text patterns and removes the signals used by AI detection tools. This helps your text appear more human written and natural."
  },
  {
    question: "Can Vanish AI make AI text undetectable?",
    answer: "Vanish AI helps reduce AI detection signals in your text, making it more likely to pass many AI detection tools. Results may vary depending on the detector used."
  },
  {
  question: "Which AI tools does Vanish AI work with?",
  answer: "Vanish AI works well with AI generated text from popular tools such as ChatGPT, Claude, Gemini,Copilot and other AI writing assistants. Paste your AI generated text into Vanish AI and the tool will process it while preserving your original wording."
},
  {
    question: "Is my text stored or saved?",
    answer: "No. Vanish AI does not store or save your content. Your text is processed securely and is not kept on our servers."
  },
  {
    question: "Can I use Vanish AI for essays, blogs, or assignments?",
    answer: "Yes. Vanish AI can help improve AI generated text for essays, blogs, articles, and other content by making it read more naturally."
  },
  {
    question: "Is Vanish AI free to use?",
    answer: "Yes. Our goal is to provide a simple AI humanizer tool that anyone can use easily. Some advanced features may be added in the future."
  }
  ];

  const processingMessages = [
  "Analyzing text...",
  "Breaking AI patterns...",
  "Neutralizing signals...",
  "Finalizing output..."
];

  const countWords = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 scroll-smooth overflow-x-hidden">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <img
                src="/logo3.svg"
                alt="Vanish AI Logo"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <span className="font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Vanish AI
                </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-6 text-sm font-medium text-gray-300">
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition-colors">How it Works</a>
            <a href="#tool" onClick={(e) => scrollToSection(e, 'tool')} className="hover:text-white transition-colors">Tool</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-white transition-colors">FAQ</a>
            <a href="#feedback" onClick={(e) => scrollToSection(e, 'feedback')} className="hover:text-white transition-colors">Feedback</a>
          </nav>

          <button 
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden glass border-t border-white/10 overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4 gap-4 text-base font-medium text-gray-300">
                <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="block py-2 hover:text-white transition-colors w-full">How it Works</a>
                <a href="#tool" onClick={(e) => scrollToSection(e, 'tool')} className="block py-2 hover:text-white transition-colors w-full">Tool</a>
                <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="block py-2 hover:text-white transition-colors w-full">FAQ</a>
                <a href="#feedback" onClick={(e) => scrollToSection(e, 'feedback')} className="block py-2 hover:text-white transition-colors w-full">Feedback</a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
          >
            <span className="sm:whitespace-nowrap">No Rewrites. No Edits.</span>
            <span>Keep Every Word Exactly as Generated,</span>
            <span className="text-gradient">While AI Signals Disappear.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto px-2"
          >
            Welcome to the next generation AI humanizer. Vanish AI removes AI traces without changing your words.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-2"
          >
            <button
              onClick={(e) => scrollToSection(e, 'tool')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(176,38,255,0.3)]"
            >
              Start Vanishing <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>


      {/* Core Tool Section */}
      <section id="tool" className="pt-8 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">


          <div className="glass glow-border rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-400 mb-1 sm:mb-0">Strength:</span>
                <div className="flex flex-wrap bg-surface rounded-lg p-1 w-full sm:w-auto">
                  {(['Light', 'Medium', 'Strong'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setStrength(level)}
                      className={`flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-sm font-medium rounded-md transition-all ${strength === level ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleClear} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 min-h-[44px] sm:min-h-0 text-sm text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg border border-white/5 sm:border-none">
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>

            {/* Editor Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-2">
                  <span className="font-semibold text-gray-300">Input Text</span>
                  <span className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap ml-2">{countWords(inputText)} words | {inputText.length} chars</span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your AI-generated text here (minimum 50 words recommended)..."
                  className="w-full h-64 sm:h-80 bg-surface/50 border border-white/10 rounded-xl p-4 text-base sm:text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y transition-all"
                />
              </div>

              {/* Output */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-2">
                  <span className="font-semibold text-primary">Output Text</span>
                  <span className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap ml-2">{countWords(outputText)} words | {outputText.length} chars</span>
                </div>
                <div className="relative h-64 sm:h-80">
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Your output text will appear here..."
                    className="w-full h-full bg-surface border border-white/5 rounded-xl p-4 text-base sm:text-sm text-gray-100 placeholder-gray-700 focus:outline-none resize-y"
                  />
                  {outputText && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2">
                      <button
                          onClick={() => {
                          const blob = new Blob([outputText], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "vanish-ai-output.txt";
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="p-2 sm:p-2 bg-background/80 hover:bg-background backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all group min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        title="Download as .txt"
                      >
  <span className="text-xs font-bold">TXT</span>
</button>
                      <button
                        onClick={handleCopy}
                        className="p-2 sm:p-2 bg-background/80 hover:bg-background backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all group min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleHumanise}
                disabled={isProcessing || !inputText.trim()}
                className="w-full sm:w-auto flex justify-center items-center gap-2 px-12 py-4 min-h-[48px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] shadow-lg active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                    <span>{processingMessages[processingStep]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Process Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-surface/30">
        <div className="container mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '1', title: 'Paste Text', desc: 'Paste your AI generated text into the Vanish AI humanizer tool.' },
              { step: '2', title: 'Process', desc: 'Vanish AI processes your text and removes AI detection patterns while keeping your words the same.' },
              { step: '3', title: 'Copy & Use', desc: 'Copy your human like, undetectable text and use it anywhere with confidence.' },
            ].map((s, i) => (
              <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl mb-4 shrink-0">
                  {s.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Why Use Vanish AI Section */}
<section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
  <div className="container mx-auto max-w-5xl text-center">

    <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">
      Why Use Vanish AI?
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

      <div className="glass p-6 sm:p-8 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold mb-2">
          Your Text Stays the Same
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Vanish AI does not rewrite your content. Your original AI generated text stays exactly the same.
        </p>
      </div>

      <div className="glass p-6 sm:p-8 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold mb-2">
          Break AI Detection Patterns
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Vanish AI analyzes the hidden patterns used by AI detectors and neutralizes them without changing your words.
        </p>
      </div>

      <div className="glass p-6 sm:p-8 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold mb-2">
          Reduce Detectable AI Signals
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          The tool removes AI signals that detectors look for, helping your text appear more natural.
        </p>
      </div>

      <div className="glass p-6 sm:p-8 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-bold mb-2">
          Simple and Fast Process
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Paste your AI-generated text, process it in seconds, and copy the output instantly.
        </p>
      </div>

    </div>

  </div>
</section>

{/* Who Can Benefit from Vanish AI? Section */}
<section className="py-16 sm:py-20 bg-surface/30 px-4 sm:px-6 lg:px-8">
  <div className="container mx-auto max-w-6xl text-center">
    <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Who Can Benefit from Vanish AI?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[
        { icon: Briefcase, title: 'Job Seekers', desc: 'Remove AI traces from resumes and cover letters so they read naturally and feel genuinely written by you, helping them appear more authentic to recruiters.' },
        { icon: PenTool, title: 'Writers & Bloggers', desc: 'Clean up AI fingerprints in drafts so the content reads smoothly and maintains a natural, human writing flow.' },
        { icon: Building, title: 'Professionals', desc: 'Refine emails, reports, and documents by eliminating AI patterns, making the writing sound clear, natural, and professionally written.' },
        { icon: Mic, title: 'Content Creators', desc: 'Remove AI generated patterns from scripts, captions, and posts so the content feels authentic and connects better with your audience.' },
        { icon: Megaphone, title: 'Marketers', desc: 'Polish marketing copy by clearing AI traces, allowing the message to sound more natural, persuasive, and human.' },
        { icon: GraduationCap, title: 'Students', desc: 'Clean AI traces from assignments and essays so the writing reads naturally and reflects a more genuine human tone.' }
      ].map((card, i) => (
        <div key={i} className="glass group p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(176,38,255,0.3)] hover:bg-white/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <card.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
          </div>
          <h3 className="text-xl font-bold mb-4">{card.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-surface/30">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between focus:outline-none min-h-[56px]"
                >
                  <span className="font-semibold text-base sm:text-lg pr-4">{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 sm:p-6 pt-0 text-sm sm:text-base text-gray-400 border-t border-white/5 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
          <section id="feedback" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto container">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">We Value Your Feedback</h2>
              <p className="text-sm sm:text-base text-gray-400 mt-2">
                Help us improve Vanish AI by sharing your experience.
              </p>
            </div>
          <div className="glass p-6 sm:p-8 rounded-2xl text-left">
            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-sm sm:text-base text-gray-400">Thank you for your feedback.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-5 sm:gap-6">
                {/* Honeypot field (hidden from real users but visible to bots) */}
                <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
                  <label htmlFor="website-url">Website URL (leave blank if human)</label>
                  <input
                    type="text"
                    id="website-url"
                    name="website-url"
                    tabIndex={-1}
                    value={feedbackHoneypot}
                    onChange={(e) => setFeedbackHoneypot(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 min-h-[44px] text-base sm:text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email (optional)</label>
                  <input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-surface/50 border border-white/10 rounded-xl p-3 min-h-[44px] text-base sm:text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Feedback</label>
                  <textarea
                    required
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full h-32 bg-surface/50 border border-white/10 rounded-xl p-3 text-base sm:text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!feedbackName.trim() || !feedbackMessage.trim()}
                  className="w-full py-3 min-h-[48px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] shadow-lg"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-background text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Vanish AI. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500 max-w-xl mx-auto">
              Vanish AI provides automated text processing. Results may vary depending on the input text.
          </p>
          <div className="mt-4 flex justify-center gap-4">
<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setPopup("privacy");
  }}
  className="hover:text-primary transition-colors"
>
  Privacy Policy
</a>

<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setPopup("terms");
  }}
  className="hover:text-primary transition-colors"
>
  Terms of Service
</a>
            <a href="mailto:hello@example.com" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      {popup && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
    onClick={() => setPopup(null)}
  >
    <div
      className="bg-surface border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto text-left"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="float-right text-gray-400 hover:text-white"
        onClick={() => setPopup(null)}
      >
        ✕
      </button>

        {popup === "privacy" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <pre className="text-gray-400 whitespace-pre-wrap text-sm">
              {privacyPolicy}
            </pre>
          </div>
        )}

        {popup === "terms" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <pre className="text-gray-400 whitespace-pre-wrap text-sm">
              {termsOfService}
            </pre>
          </div>
        )}

    </div>
  </div>
)}
    </div>
  );
}

export default App;
