
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TalentoAI</span>
        </motion.div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <motion.a
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Accueil
          </motion.a>
          <motion.a
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mes documents
          </motion.a>
          <motion.a
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Quiz
          </motion.a>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button>Connexion</Button>
          </motion.div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
              >
                Accueil
              </a>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
              >
                Mes documents
              </a>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
              >
                Quiz
              </a>
              <Button className="w-full">Connexion</Button>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
