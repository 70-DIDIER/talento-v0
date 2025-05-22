import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw } from "lucide-react"; // CheckCircle, XCircle removed as they are not used
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateQuizAPI } from "../../lib/deepseek";

// QuizGenerator now only takes `summaryForQuiz` and `onStartQuiz`
// The `document` prop has been removed.
const QuizGenerator = ({ summaryForQuiz, onStartQuiz }) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!summaryForQuiz) {
      toast({
        title: "Erreur",
        description: "Le résumé du texte n'est pas disponible pour générer le quiz.", // Changed from "document"
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const quiz = await generateQuizAPI(summaryForQuiz, numQuestions, difficulty);
      
      toast({
        title: "Quiz généré avec succès",
        description: `${quiz.questions.length} questions ont été créées pour votre quiz "${quiz.title}".`,
      });
      
      onStartQuiz(quiz);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast({
        title: "Erreur de génération du quiz",
        description: error.message || "Une erreur est survenue lors de la communication avec l'API.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="bg-primary/10 pb-4">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-primary mr-2" />
            <CardTitle className="text-xl">Générer un quiz</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Créez un quiz personnalisé basé sur le résumé de votre texte. {/* Changed from "document" */}
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="num-questions">Nombre de questions</Label>
            <Input
              id="num-questions"
              type="number"
              min="3"
              max="15"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              disabled={isGenerating} // Disable input while generating
            />
          </div>
          
          <div className="space-y-2">
            <Label>Niveau de difficulté</Label>
            <div className="flex space-x-2">
              {["easy", "medium", "hard"].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={difficulty === level ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => setDifficulty(level)}
                  disabled={isGenerating} // Disable buttons while generating
                >
                  {level === "easy" ? "Facile" : level === "medium" ? "Moyen" : "Difficile"}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            className="w-full mt-4"
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !summaryForQuiz} // Also disable if no summary
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer le quiz"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizGenerator;
