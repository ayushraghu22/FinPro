import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary">FinPro</h3>
            <p className="text-muted-foreground text-sm">
              Empowering shopkeepers with digital solutions for better business management,
              accurate record-keeping, and financial growth.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Financial Tracking</li>
              <li>Inventory Management</li>
              <li>Invoice Processing</li>
              <li>Profit Analysis</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Training</li>
              <li>Documentation</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ShopKeeper Pro. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive" /> for small businesses
          </p>
        </div>
      </div>
    </footer>
  );
};