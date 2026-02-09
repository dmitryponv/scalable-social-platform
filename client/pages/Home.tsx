import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5ff, #fdf2f8, #ecf9ff)' }}>
      {/* Navigation */}
      <nav className="border-b-2 border-purple-200 bg-white shadow-lg" style={{ backdropFilter: 'blur(20px)', opacity: 0.8, position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="gradient-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <span className="font-black text-2xl gradient-primary-text hidden sm:inline">
                Connect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="btn-social-ghost text-sm hover:text-purple-600"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-social-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Very Colorful */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-white px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}>
                ✨ Welcome to Connect
              </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                Share Your{" "}
                <span className="gradient-primary-text block">Colorful</span>
                Story
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Connect with millions of vibrant creators. Share thoughts,
                discover amazing content, and engage with your community like
                never before.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn-social-primary text-base px-8 py-4 justify-center group"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/feed"
                className="btn-social-secondary text-base px-8 py-4 justify-center"
              >
                Explore Now
              </Link>
            </div>

            {/* Stats with Colors */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-purple-200">
              <div className="group">
                <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  50M+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Users</p>
              </div>
              <div className="group">
                <p className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  1B+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Posts</p>
              </div>
              <div className="group">
                <p className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  10B+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Likes</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Very Colorful */}
          <div className="relative">
            {/* Floating gradient shapes */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div
              className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            <div className="relative z-10 space-y-4">
              {/* Post Card 1 - Purple */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-300 p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"></div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah Chen</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-4">
                  Just shared my new creative project! 🎨✨
                </p>
                <div className="h-28 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl mb-4 shadow-md"></div>
              </div>

              {/* Post Card 2 - Cyan */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border-2 border-cyan-300 p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg"></div>
                  <div>
                    <p className="font-bold text-gray-900">Alex Rivera</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Amazing community engagement today! 🚀
                </p>
              </div>

              {/* Post Card 3 - Orange */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-300 p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg"></div>
                  <div>
                    <p className="font-bold text-gray-900">Jordan Kim</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Live session with my followers at 5PM! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Rainbow Colors */}
      <section className="py-20 sm:py-32 bg-white/50 border-y-2 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                ✨ Our Features
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 gradient-primary-text">
              Packed with Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to express yourself and connect with your
              community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards with Individual Gradients */}
            <div className="feature-card-1 shadow-2xl hover:shadow-purple-500/50">
              <MessageCircle className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Share & Post</h3>
              <p className="text-white/90">
                Express yourself with rich content, images, and multimedia
                stories.
              </p>
            </div>

            <div className="feature-card-2 shadow-2xl hover:shadow-pink-500/50">
              <Heart className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Engage & Like</h3>
              <p className="text-white/90">
                Build meaningful connections with likes, comments, and shares.
              </p>
            </div>

            <div className="feature-card-3 shadow-2xl hover:shadow-cyan-400/50">
              <Zap className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Lightning Fast</h3>
              <p className="text-white/90">
                Powered by MongoDB & Redis for ultimate speed and reliability.
              </p>
            </div>

            <div className="feature-card-4 shadow-2xl hover:shadow-orange-500/50">
              <Users className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Community</h3>
              <p className="text-white/90">
                Discover creators and build your network. Follow anyone.
              </p>
            </div>

            <div className="feature-card-5 shadow-2xl hover:shadow-green-500/50">
              <Star className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Trending</h3>
              <p className="text-white/90">
                Stay updated with trending hashtags and viral content.
              </p>
            </div>

            <div className="feature-card-6 shadow-2xl hover:shadow-fuchsia-500/50">
              <Share2 className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-3">Share & Spread</h3>
              <p className="text-white/90">
                Share posts and help content go viral in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Colorful */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="relative overflow-hidden">
          {/* Background gradient blobs */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 opacity-20 rounded-3xl filter blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 rounded-3xl p-12 sm:p-20 text-center shadow-2xl">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              Join our vibrant community of creators and discover what you can
              achieve. It's free and takes less than a minute!
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-transparent bg-clip-text font-black text-lg px-10 py-4 rounded-2xl bg-white hover:scale-110 transition-transform shadow-xl hover:shadow-2xl"
            >
              <span className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 rounded-2xl inline-block font-black">
                Create Account Now
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-purple-200 bg-gradient-to-b from-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black">C</span>
                </div>
                <span className="font-black text-lg gradient-primary-text">
                  Connect
                </span>
              </div>
              <p className="text-gray-600 font-semibold">
                Your vibrant community, your story.
              </p>
            </div>
            <div>
              <p className="font-black text-gray-900 mb-4">Product</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-black text-gray-900 mb-4">Company</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-black text-gray-900 mb-4">Legal</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-purple-200 pt-8">
            <p className="text-center text-gray-600 font-semibold">
              © 2024 Connect. Built with 💜💙💗
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
