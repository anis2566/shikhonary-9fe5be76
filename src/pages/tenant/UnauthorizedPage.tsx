import React from 'react';
import { ShieldX, ArrowLeft, LogOut, Mail, HelpCircle, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const helpCards = [
    {
      icon: Mail,
      title: 'Contact Administrator',
      description: 'Reach out to your institution administrator to request access permissions.',
      action: 'Send Email',
      onClick: () => window.location.href = 'mailto:admin@example.com?subject=Access Request',
    },
    {
      icon: HelpCircle,
      title: 'Wrong Account?',
      description: 'You might be signed in with the wrong account. Try signing out and using a different one.',
      action: 'Sign Out',
      onClick: handleSignOut,
    },
    {
      icon: Home,
      title: 'Return Home',
      description: 'Go back to the main page and navigate to the correct section.',
      action: 'Go Home',
      onClick: () => navigate('/'),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        className="max-w-3xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Error Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-destructive/20 shadow-2xl bg-card/95 backdrop-blur-sm mb-8">
            <CardHeader className="text-center pb-2 pt-8">
              <motion.div
                className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-6 ring-4 ring-destructive/10"
                variants={pulseVariants}
                animate="pulse"
              >
                <ShieldX className="h-12 w-12 text-destructive" />
              </motion.div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
                <AlertTriangle className="h-4 w-4" />
                Error 403 - Forbidden
              </div>

              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Access Denied
              </CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                You don't have the required permissions to access this area. 
                This section is restricted to authorized tenant administrators only.
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              {/* User Info */}
              {user && (
                <motion.div 
                  className="bg-muted/50 rounded-lg p-4 mb-6 border border-border/50"
                  variants={itemVariants}
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Signed in as:</span>{' '}
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If this isn't the correct account, please sign out and try again with an authorized account.
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="gap-2 min-w-[140px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="gap-2 min-w-[140px]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Cards */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            What would you like to do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {helpCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer group bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {card.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={card.onClick}
                      className="w-full justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {card.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-center text-xs text-muted-foreground mt-8"
          variants={itemVariants}
        >
          If you believe this is an error, please contact your system administrator
          <br />
          with the error code <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">ERR_403_UNAUTHORIZED</code>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
