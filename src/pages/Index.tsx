import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Financial Tracking",
      description: "Monitor your credit, debit, and loan transactions with detailed monthly reports.",
    },
    {
      icon: BarChart3,
      title: "Profit & Loss Analysis",
      description: "Get detailed insights into your business performance with visual analytics.",
    },
    {
      icon: FileText,
      title: "Smart Invoice Processing",
      description: "AI-powered invoice parsing that automatically updates your inventory.",
    },
    {
      icon: Shield,
      title: "Secure Data Storage",
      description: "Your business data is encrypted and securely stored in the cloud.",
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Share access with your team while maintaining proper permissions.",
    },
    {
      icon: DollarSign,
      title: "Loan Management",
      description: "Track your loans, EMIs, and payment schedules in one place.",
    },
  ];

  const benefits = [
    "Reduce manual errors by 95%",
    "Save 10+ hours per week",
    "Improve cash flow visibility",
    "Access real-time reports",
    "Scale your business confidently",
  ];

  return (
    <Layout showSidebar={false}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 gradient-hero opacity-90"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Shop Management
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Digital solution for accurate record-keeping, inventory management, 
            better forecasting, and financial growth opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => navigate("/auth/signup")}
              className="group"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate("/objective")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Your Shop
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for small business owners and shopkeepers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Why Choose ShopKeeper Pro?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of successful shopkeepers who have transformed their 
                business operations with our comprehensive management solution.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-financial-profit flex-shrink-0" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={() => navigate("/auth/signup")}
                >
                  Start Your Free Trial
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-financial-profit mb-2">95%</div>
                  <div className="text-muted-foreground">Accuracy Rate</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-financial-warning mb-2">24/7</div>
                  <div className="text-muted-foreground">Support</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10hrs</div>
                  <div className="text-muted-foreground">Saved/Week</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Start your journey towards better business management today. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/auth/signup")}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="ghost" 
              size="xl" 
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => navigate("/objective")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
