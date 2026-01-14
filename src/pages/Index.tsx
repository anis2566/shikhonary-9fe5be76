import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="font-display text-lg text-primary-foreground font-bold">S</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">Shikhonary</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="gradient-primary text-primary-foreground hover:opacity-90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-up">
            <span>🎓</span>
            <span>Transform Your Learning Experience</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Learn Smarter, <br />
            <span className="text-primary">Achieve More</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Shikhonary is your personalized learning companion. Access courses, track progress, 
            and connect with educators—all in one beautiful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="gradient-primary text-primary-foreground hover:opacity-90 px-8 py-6 text-lg"
            >
              Start Learning Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg border-2"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Shikhonary?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for modern learners who demand excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Rich Course Library
              </h3>
              <p className="text-muted-foreground">
                Access hundreds of courses across various subjects, designed by expert educators.
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Community Learning
              </h3>
              <p className="text-muted-foreground">
                Connect with fellow learners, share insights, and grow together.
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Certified Progress
              </h3>
              <p className="text-muted-foreground">
                Earn certificates as you complete courses and showcase your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="gradient-primary rounded-3xl p-12 sm:p-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners who have transformed their skills with Shikhonary.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-lg font-medium"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Shikhonary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
