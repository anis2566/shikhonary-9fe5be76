import React from 'react';
import { BookOpen, GraduationCap, Lightbulb, PenTool } from 'lucide-react';

const AuthIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float">
        <BookOpen className="w-8 h-8 text-primary-foreground" />
      </div>
      
      <div className="absolute top-40 right-16 w-14 h-14 rounded-xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
        <Lightbulb className="w-7 h-7 text-primary-foreground" />
      </div>
      
      <div className="absolute bottom-32 left-16 w-12 h-12 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
        <PenTool className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div className="absolute bottom-20 right-24 w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
        <GraduationCap className="w-10 h-10 text-primary-foreground" />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-8 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
          <span className="font-display text-4xl text-primary-foreground font-bold">S</span>
        </div>
        
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
          Learn Without Limits
        </h2>
        
        <p className="text-primary-foreground/80 text-lg leading-relaxed">
          Start your journey with Shikhonary and unlock a world of knowledge tailored just for you.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">10K+</div>
            <div className="text-sm text-primary-foreground/70">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">500+</div>
            <div className="text-sm text-primary-foreground/70">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-foreground">98%</div>
            <div className="text-sm text-primary-foreground/70">Success</div>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-foreground/5" />
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/5" />
    </div>
  );
};

export default AuthIllustration;
