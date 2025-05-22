import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
// Renamed import: FileUpload -> TextInputArea
import TextInputArea from "@/components/TextInputArea"; 
import DocumentSummary from "@/components/DocumentSummary";
import QuizGenerator from "@/components/QuizGenerator";
import QuizInterface from "@/components/QuizInterface";
import { generateSummaryAPI } from "@/lib/deepseek"; 

// SVG Icons for the gradient card (can be replaced with lucide-react if preferred and available)
const TextInputIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const SummarizeIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.625a2.25 2.25 0 01-2.25-2.25V7.125c0-.621.504-1.125 1.125-1.125H9M12 4.5v.008v.008H12v-.016zm0 2.25v.008v.008H12V6.75zm0 2.25v.008v.008H12V9zm0 2.25v.008v.008H12v-.008z" />
  </svg>
);
const QuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);


function App() {
  // Removed activeDocument, using submittedText instead
  const [submittedText, setSubmittedText] = useState(""); 
  const [documentSummary, setDocumentSummary] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  // Default activeTab to "summary" when tabs are shown, or handle initial state before tabs
  const [activeTab, setActiveTab] = useState("summary"); 
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const handleTextSubmit = async (textFromInput) => {
    setIsSummarizing(true);
    setSubmittedText(textFromInput);
    setDocumentSummary(""); // Clear previous summary
    setActiveQuiz(null); // Clear previous quiz
    setActiveTab("summary"); // Set tab for when summary appears

    try {
      const summary = await generateSummaryAPI(textFromInput);
      setDocumentSummary(summary);
      // setActiveTab("summary") is already set, or will be the default when Tabs view renders
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        title: "Erreur de résumé",
        description: error.message || "Une erreur est survenue lors de la génération du résumé.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClearSummary = () => {
    setSubmittedText("");
    setDocumentSummary("");
    setActiveQuiz(null);
    // No need to change activeTab, as the component will switch view
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActiveTab("generate"); // Or "quiz" - make sure this tab value matches a TabsTrigger
  };

  const handleFinishQuiz = () => {
    setActiveQuiz(null);
    setActiveTab("summary");
  };

  const handleRestartQuiz = () => {
    // setActiveQuiz(null); // QuizInterface will be replaced by QuizGenerator
    setActiveTab("generate");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Révision Intelligente avec l'IA
            </h1>
            <p className="text-muted-foreground">
              {/* Updated tagline */}
              Saisissez votre texte, obtenez des résumés et testez vos connaissances avec des quiz personnalisés.
            </p>
          </div>
          
          {!documentSummary ? (
            // Show TextInputArea and initial welcome/info if no summary yet
            <>
              <div className="gradient-bg text-white rounded-lg p-8 text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Améliorez votre apprentissage avec l'IA
                </h2>
                <p className="mb-6">
                  Saisissez votre texte ci-dessous et laissez notre IA vous aider à mieux comprendre et mémoriser le contenu.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <TextInputIcon />
                    </div>
                    <h3 className="font-medium mb-2">Entrez votre texte</h3>
                    <p className="text-sm opacity-80">Collez ou écrivez directement le contenu à étudier.</p>
                  </div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <SummarizeIcon />
                    </div>
                    <h3 className="font-medium mb-2">Résumez</h3>
                    <p className="text-sm opacity-80">Obtenez un résumé intelligent généré par IA.</p>
                  </div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <QuizIcon />
                    </div>
                    <h3 className="font-medium mb-2">Testez</h3>
                    <p className="text-sm opacity-80">Créez des quiz personnalisés pour tester vos connaissances.</p>
                  </div>
                </div>
              </div>
              <TextInputArea onTextSubmit={handleTextSubmit} isLoading={isSummarizing} />
            </>
          ) : (
            // Show Tabs for Summary and Quiz Generation if summary exists
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8"> {/* Only 2 tabs now */}
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="generate" disabled={!documentSummary || isSummarizing}>
                  Quiz {/* This is the tab where QuizGenerator/QuizInterface will live */}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-0">
                <DocumentSummary 
                  summary={documentSummary}
                  onClearSummary={handleClearSummary} 
                  // originalText={submittedText} // Optionally pass if DocumentSummary uses it
                />
              </TabsContent>
              
              <TabsContent value="generate" className="mt-0">
                {!activeQuiz ? (
                  <QuizGenerator 
                    summaryForQuiz={documentSummary} 
                    onStartQuiz={handleStartQuiz}
                    // document prop removed
                  />
                ) : (
                  <QuizInterface 
                    quiz={activeQuiz} 
                    onFinish={handleFinishQuiz}
                    onRestart={handleRestartQuiz}
                  />
                )}
              </TabsContent>
              {/* Removed the separate "quiz" tab content, as QuizInterface is now part of "generate" tab */}
            </Tabs>
          )}
        </motion.div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        {/* Footer content remains the same */}
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © 2025 Talento. Tous droits réservés.
          </p>
          {/* ... other footer links ... */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Confidentialité
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Conditions
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}

export default App;
