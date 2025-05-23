import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast"; // Added
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import DocumentSummary from "@/components/DocumentSummary";
import QuizGenerator from "@/components/QuizGenerator";
import QuizInterface from "@/components/QuizInterface";
import { generateSummaryAPI } from "@/lib/deepseek"; // Added

// Exemple d'extraction de la prop "dismiss" pour éviter de la passer à l'élément <li>
const ToastItem = ({ dismiss, ...props }) => {
  // Utilisez "dismiss" dans le composant sans l'émettre dans le JSX final
  return <li {...props}>{/* contenu du toast */}</li>;
};

function App() {
  const [activeDocument, setActiveDocument] = useState(null);
  const [documentSummary, setDocumentSummary] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isSummarizing, setIsSummarizing] = useState(false); // Added
  const { toast } = useToast(); // Added

  const handleFileUpload = (file) => {
    setActiveDocument(file);
    setIsSummarizing(true);
    setDocumentSummary(""); // Clear previous summary

    const reader = new FileReader();
    reader.onload = async (e) => {
      const textContent = e.target.result;
      try {
        // Ensure API key is set (developer responsibility, not user)
        // You might want to set the API key in a more global place, e.g. when the app loads
        // import { setDeepSeekApiKey } from "../lib/deepseek";
        // setDeepSeekApiKey("YOUR_ACTUAL_API_KEY"); // This should not be hardcoded here in a real app

        const summary = await generateSummaryAPI(textContent);
        setDocumentSummary(summary);
        setActiveTab("summary");
      } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
          title: "Erreur de résumé",
          description: error.message || "Une erreur est survenue lors de la génération du résumé.",
          variant: "destructive",
        });
        // Optionally clear the summary or document if it fails
        // setDocumentSummary(""); 
      } finally {
        setIsSummarizing(false);
      }
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      toast({ title: "Erreur de lecture", description: "Impossible de lire le contenu du fichier.", variant: "destructive" });
      setIsSummarizing(false);
      setActiveDocument(null); // Optionally reset
    };
    reader.readAsText(file);
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActiveTab("quiz");
  };

  const handleFinishQuiz = () => {
    setActiveQuiz(null);
    setActiveTab("summary");
  };

  const handleRestartQuiz = () => {
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
              Téléchargez vos documents, obtenez des résumés et testez vos connaissances avec des quiz personnalisés.
            </p>
          </div>
          
          {activeDocument ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="upload" disabled={isSummarizing}>Document</TabsTrigger>
                <TabsTrigger value="summary" disabled={isSummarizing || !documentSummary}>Résumé</TabsTrigger>
                <TabsTrigger value="generate" disabled={isSummarizing || !documentSummary}>
                  Quiz
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <FileUpload onFileUpload={handleFileUpload} disabled={isSummarizing} isLoading={isSummarizing} />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                {documentSummary && (
                  <DocumentSummary 
                    document={activeDocument} 
                    summary={documentSummary} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="generate" className="mt-0">
                {!activeQuiz ? (
                  <QuizGenerator 
                    document={activeDocument} 
                    summaryForQuiz={documentSummary} // Added this prop
                    onStartQuiz={handleStartQuiz} 
                  />
                ) : (
                  <QuizInterface 
                    quiz={activeQuiz} 
                    onFinish={handleFinishQuiz}
                    onRestart={handleRestartQuiz}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                {activeQuiz && (
                  <QuizInterface 
                    quiz={activeQuiz} 
                    onFinish={handleFinishQuiz}
                    onRestart={handleRestartQuiz}
                  />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-8">
              <div className="gradient-bg text-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Améliorez votre apprentissage avec l'IA
                </h2>
                <p className="mb-6">
                  Téléchargez vos documents de cours et laissez notre IA vous aider à mieux comprendre et mémoriser le contenu
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      {/* Placeholder for Upload Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338 0 4.5 4.5 0 01-1.41 8.775H6.75z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Téléchargez</h3>
                    <p className="text-sm opacity-80">Importez vos documents de cours (PDF, DOC, TXT)</p>
                  </div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      {/* Placeholder for AI Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-7.5h10.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 8.25v3.5A2.25 2.25 0 006.75 14.25z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Résumez</h3>
                    <p className="text-sm opacity-80">Obtenez un résumé intelligent généré par IA</p>
                  </div>
                  <div className="glass-card rounded-lg p-4 text-center">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      {/* Placeholder for Quiz Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-2">Testez</h3>
                    <p className="text-sm opacity-80">Créez des quiz personnalisés pour tester vos connaissances</p>
                  </div>
                </div>
              </div>
              
              <FileUpload onFileUpload={handleFileUpload} disabled={isSummarizing} isLoading={isSummarizing} />
            </div>
          )}
        </motion.div>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © 2025 Talento. Tous droits réservés.
          </p>
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
