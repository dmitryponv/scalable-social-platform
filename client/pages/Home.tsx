import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Users, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline gradient-primary-text">
                Connect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="btn-social-ghost text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-social-primary text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Connect with
                <br />
                <span className="gradient-primary-text">Your Community</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Share your thoughts, discover amazing content, and engage with millions of users worldwide. Built for the modern social era.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn-social-primary text-base px-6 py-3 justify-center"
              >
                Create Account
              </Link>
              <Link
                to="/feed"
                className="btn-social-ghost text-base px-6 py-3 justify-center border border-border"
              >
                Explore Feed
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold">50M+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1B+</p>
                <p className="text-sm text-muted-foreground">Daily Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10B+</p>
                <p className="text-sm text-muted-foreground">Interactions</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute inset-0 gradient-primary opacity-20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border border-border/50 p-8 sm:p-12">
              <div className="space-y-6">
                {/* Sample Post Card */}
                <div className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                    <div>
                      <p className="font-semibold">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Just launched my new project! Super excited to share it with you all 🚀
                  </p>
                  <div className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4"></div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">324</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-secondary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">42</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-accent transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">108</span>
                    </button>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card rounded-lg border border-border p-3 text-center">
                    <p className="text-sm font-semibold text-primary">324</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="bg-card rounded-lg border border-border p-3 text-center">
                    <p className="text-sm font-semibold text-secondary">42</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                  <div className="bg-card rounded-lg border border-border p-3 text-center">
                    <p className="text-sm font-semibold text-accent">108</p>
                    <p className="text-xs text-muted-foreground">Shares</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border py-20 sm:py-32 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for modern social interaction and community building
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Share & Post</h3>
              <p className="text-muted-foreground">
                Express yourself with rich text, images, and multimedia. Blog posts, updates, and stories all in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Engage & Interact</h3>
              <p className="text-muted-foreground">
                Like posts, leave comments, and share content. Build meaningful connections with your community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">
                Advanced encryption, secure authentication, and password protection. Your privacy matters to us.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Community First</h3>
              <p className="text-muted-foreground">
                Discover communities, follow creators, and build your network. Connect with people who matter.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized performance with Redis caching and MongoDB. Scales to millions of users seamlessly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-card border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Share & Spread</h3>
              <p className="text-muted-foreground">
                Share posts with your network. Viral content, trending topics, and trending creators all discoverable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl border border-border p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Connect?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join millions of users and start sharing your story today. It only takes a minute to get started.
          </p>
          <Link
            to="/register"
            className="btn-social-primary inline-block text-lg px-8 py-4"
          >
            Create Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="font-bold gradient-primary-text">Connect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your community, your space, your voice.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-4">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
