import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  DollarSign,
  PieChart,
  Upload,
  Receipt,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Objective = () => {
  const navigate = useNavigate();

  const objectives = [
    {
      icon: Target,
      title: "Business Digitization",
      description: "Transform traditional shop management into a modern, digital workflow",
      benefits: ["Reduce paperwork", "Faster operations", "Better organization"]
    },
    {
      icon: TrendingUp,
      title: "Accurate Record-Keeping",
      description: "Maintain precise financial and inventory records with automated tracking",
      benefits: ["Error-free entries", "Real-time updates", "Audit trails"]
    },
    {
      icon: BarChart3,
      title: "Inventory Management",
      description: "Smart inventory tracking with automated stock updates and alerts",
      benefits: ["Stock optimization", "Automatic reordering", "Wastage reduction"]
    },
    {
      icon: PieChart,
      title: "Better Forecasting",
      description: "Data-driven insights for informed business decisions and planning",
      benefits: ["Demand prediction", "Seasonal trends", "Growth planning"]
    },
    {
      icon: DollarSign,
      title: "Financial Aid Opportunities",
      description: "Access to loans, credit facilities, and financial assistance programs",
      benefits: ["Loan matching", "Credit scoring", "Financial guidance"]
    },
    {
      icon: FileText,
      title: "Automated Documentation",
      description: "AI-powered invoice processing and automatic data entry",
      benefits: ["Invoice parsing", "Data extraction", "Template generation"]
    },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Track Finances",
      description: "Monitor credit, debit, and loan transactions monthly"
    },
    {
      icon: PieChart,
      title: "Profit & Loss Analysis",
      description: "Visual representation of your business performance"
    },
    {
      icon: DollarSign,
      title: "Loan Management",
      description: "Pre-entered loan tracking and payment schedules"
    },
    {
      icon: Receipt,
      title: "Bill Management",
      description: "Track monthly rents and bills to be paid"
    },
    {
      icon: Upload,
      title: "Invoice Processing",
      description: "AI-powered parsing of purchase and sales invoices"
    },
    {
      icon: BarChart3,
      title: "Visual Reports",
      description: "Credit-debit pictorial representation and analytics"
    },
  ];

  return (
    <Layout showSidebar={false}>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Our Mission & Objectives
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Empowering shopkeepers with digital solutions for accurate record-keeping, 
            inventory management, better forecasting, and financial growth opportunities.
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate("/auth/signup")}
          >
            Join Our Mission
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Main Objectives */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Core Objectives
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how ShopKeeper Pro addresses the key challenges faced by small business owners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => {
              const Icon = objective.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{objective.title}</CardTitle>
                    <CardDescription className="text-base">
                      {objective.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {objective.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-financial-profit flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Feature Set
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your shop efficiently in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Expected Impact
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                ShopKeeper Pro is designed to create measurable positive changes in how 
                small businesses operate and grow.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-financial-profit/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-financial-profit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Business Growth</h3>
                    <p className="text-muted-foreground">
                      Better decision making leads to sustainable business growth and expansion opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Operational Efficiency</h3>
                    <p className="text-muted-foreground">
                      Streamlined processes reduce time spent on manual tasks and improve accuracy.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-financial-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-financial-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Financial Health</h3>
                    <p className="text-muted-foreground">
                      Better financial tracking and management leads to improved cash flow and profitability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="shadow-card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Reduction in Manual Errors</div>
              </Card>
              <Card className="shadow-card p-6 text-center">
                <div className="text-3xl font-bold text-financial-profit mb-2">10hrs</div>
                <div className="text-sm text-muted-foreground">Saved Per Week</div>
              </Card>
              <Card className="shadow-card p-6 text-center">
                <div className="text-3xl font-bold text-financial-warning mb-2">3x</div>
                <div className="text-sm text-muted-foreground">Faster Invoice Processing</div>
              </Card>
              <Card className="shadow-card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Digital Transformation</div>
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
            Join the digital revolution and experience the benefits of modern shop management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/auth/signup")}
            >
              Get Started Now
            </Button>
            <Button 
              variant="ghost" 
              size="xl" 
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Objective;