"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { memo, useMemo } from "react";
import {
  Key,
  Shield,
  Zap,
  MessageSquare,
  Lock,
  Globe,
  Code,
  Sparkles,
  ArrowRight,
  Check,
  Github,
  Twitter,
  Heart,
} from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import dynamic from "next/dynamic";

const FuzzyText = dynamic(() => import("@/components/reactbits/FuzzyText"), {
  ssr: false,
  loading: () => (
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
      Your Keys, Your Privacy, Your AI Assistant
    </h1>
  ),
});

const TargetCursor = dynamic(
  () => import("@/components/reactbits/TargetCursor"),
  {
    ssr: false,
  }
);

const MagnetLines = dynamic(
  () => import("@/components/reactbits/MagnetLines"),
  {
    ssr: false,
  }
);

const Orb = dynamic(() => import("@/components/reactbits/Orb"), {
  ssr: false,
});

const ClickSpark = dynamic(() => import("@/components/reactbits/ClickSpark"), {
  ssr: false,
});

export default function LandingPage() {
  const features = [
    {
      icon: Key,
      title: "Bring Your Own Keys",
      description:
        "Use your own API keys from OpenAI, Anthropic, Google, and more. Full control over your credentials and costs.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Intelligent Context Management",
      description:
        "Automatic conversation summarization keeps context coherent while staying within token limits. Smart windowing retains recent messages with background summarization.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Provider Rotation & Resiliency",
      description:
        "Built-in rotation for Cloudflare Workers and multiple API keys. Automatic failover prevents throttling and ensures uninterrupted conversations.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Globe,
      title: "IndexedDB Local Storage",
      description:
        "All your chats, settings, and API keys stored locally in your browser. Zero server dependency, complete data ownership with offline support.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Code,
      title: "Real-time API Validation",
      description:
        "Test API keys instantly with selected models. Fetch available models dynamically and validate credentials before saving.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: MessageSquare,
      title: "Advanced Export System",
      description:
        "Export individual chats or complete configurations including providers and settings. Easy migration and backup with JSON format.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const useCases = [
    "Professional developers needing AI assistance",
    "Researchers requiring private AI conversations",
    "Teams wanting cost-effective AI solutions",
    "Privacy-conscious users avoiding data collection",
    "Organizations with specific compliance needs",
    "Anyone wanting full control over their AI tools",
    "Users who need to validate and test API keys and integrations",
    "People experimenting with system prompts and comparing different LLM behaviors, or who want separate chats with separate system prompts",
  ];

  const providers = [
    { name: "OpenAI", models: "GPT-4, GPT-5" },
    { name: "Anthropic", models: "Claude Opus, Sonnet" },
    { name: "Google", models: "Gemini Pro, Flash" },
    { name: "Mistral", models: "Mistral Large, Medium" },
    { name: "Groq", models: "Llama 3, 4" },
    { name: "DeepSeek", models: "DeepSeek V2" },
  ];

  return (
    <ClickSpark
      sparkColor="#60a5fa"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
      easing="ease-out"
      extraScale={1.2}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-x-hidden scroll-smooth">
        {}
        <TargetCursor />

        {}
        <div className="fixed inset-0 pointer-events-none opacity-10 z-0 will-change-transform">
          <MagnetLines
            lineColor="rgba(59, 130, 246, 0.5)"
            lineWidth="0.3vmin"
            rows={15}
            columns={15}
            containerSize="100%"
          />
        </div>

        {}
        <div className="fixed top-20 right-10 md:right-20 w-64 h-64 pointer-events-none opacity-20 blur-2xl z-0 will-change-transform">
          <Orb hue={220} hoverIntensity={0.2} rotateOnHover={false} />
        </div>

        {}
        <nav className="relative z-10 border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BYOK Chat
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <Link
                href="https://github.com/0xarchit/ByokChat"
                target="_blank"
                className="hover:text-blue-400 transition-colors cursor-target"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link href="/chat" className="cursor-target">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 cursor-target text-sm sm:text-base px-3 sm:px-4 py-2">
                  Launch App{" "}
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </nav>

        {}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <AnimatedContent distance={50} duration={1}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Open Source AI Chat Platform
                </span>
              </motion.div>
            </AnimatedContent>

            <AnimatedContent distance={80} duration={1} delay={0.3}>
              <div className="cursor-target mb-8 w-full flex items-center justify-center px-4">
                <div className="max-w-full flex justify-center items-center">
                  <FuzzyText
                    fontSize="clamp(1.5rem, 5vw, 3.5rem)"
                    fontWeight={900}
                    color="#fff"
                    enableHover={true}
                  >
                    Your Keys, Your Privacy, Your AI Assistant
                  </FuzzyText>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={80} duration={1} delay={0.5}>
              <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed px-4">
                BYOK Chat empowers you with complete control over your AI
                conversations. Use your own API keys, keep your data private,
                and enjoy unlimited conversations without any middleman.
              </p>
            </AnimatedContent>

            <AnimatedContent distance={50} duration={1} delay={0.7}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <Link href="/chat" className="cursor-target w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 cursor-target"
                  >
                    Get Started Free{" "}
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                  </Button>
                </Link>
                <Link
                  href="https://github.com/0xarchit/ByokChat"
                  target="_blank"
                  className="cursor-target w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 bg-white/5 hover:bg-white/15 text-white hover:text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 cursor-target"
                  >
                    <Github className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedContent distance={50}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                Why Choose BYOK Chat?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 px-4">
                Built for privacy, performance, and complete control
              </p>
            </div>
          </AnimatedContent>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <AnimatedContent key={index} distance={80} delay={index * 0.1}>
                <SpotlightCard className="h-full cursor-target">
                  <Card className="h-full bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </section>

        {}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedContent distance={50}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                Works With Your Favorite AI Providers
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 px-4">
                Connect to multiple AI providers with your own API keys
              </p>
            </div>
          </AnimatedContent>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {providers.map((provider, index) => (
              <AnimatedContent key={index} distance={50} delay={index * 0.05}>
                <Card className="cursor-target bg-white/5 border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-1 text-white">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-400">{provider.models}</p>
                  </CardContent>
                </Card>
              </AnimatedContent>
            ))}
          </div>
        </section>

        {}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <AnimatedContent distance={50}>
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                  Perfect For
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 px-4">
                  Designed for everyone who values privacy and control
                </p>
              </div>
            </AnimatedContent>

            <div className="grid sm:grid-cols-2 gap-4">
              {useCases.map((useCase, index) => (
                <AnimatedContent key={index} distance={30} delay={index * 0.1}>
                  <div className="cursor-target flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{useCase}</span>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {}
        <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedContent distance={80}>
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-8 sm:p-12 backdrop-blur-sm">
              <Lock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                Ready to Take Control?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 px-4">
                Start using BYOK Chat today. No signup required, completely free
                and open source.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Link href="/chat" className="cursor-target w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 cursor-target"
                  >
                    Launch BYOK Chat{" "}
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                  </Button>
                </Link>
                <Link
                  href="https://github.com/0xarchit/ByokChat"
                  target="_blank"
                  className="cursor-target w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 bg-white/5 hover:bg-white/15 text-white hover:text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 cursor-target"
                  >
                    <Github className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                    Star on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedContent>
        </section>

        {}
        <footer className="relative z-10 border-t border-white/10 py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Key className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  BYOK Chat
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 cursor-target">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>by</span>
                <Link
                  href="https://github.com/0xarchit"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300"
                >
                  0xarchit
                </Link>
              </div>

              <div className="flex items-center gap-4 cursor-target">
                <Link
                  href="https://github.com/0xarchit/ByokChat"
                  target="_blank"
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-target"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href="https://twitter.com/0xarchit"
                  target="_blank"
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-target"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="text-center mt-8 text-sm text-gray-500">
              <p>© 2025 BYOK Chat. Open source under MIT License.</p>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}
