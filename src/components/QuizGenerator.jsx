
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const QuizGenerator = ({ document, onStartQuiz }) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    
    // Simulate quiz generation delay
    setTimeout(() => {
      setIsGenerating(false);
      
      // Generate mock quiz questions
      const quiz = generateMockQuiz(numQuestions, difficulty, document.name);
      
      toast({
        title: "Quiz généré avec succès",
        description: `${numQuestions} questions ont été créées pour votre quiz.`,
      });
      
      onStartQuiz(quiz);
    }, 2000);
  };

  const generateMockQuiz = (count, difficulty, documentName) => {
    const difficultyFactors = {
      easy: "basiques",
      medium: "intermédiaires",
      hard: "avancées"
    };
    
    // Mock questions based on common educational topics
    const questions = [
      {
        question: `Quelle est la principale thématique abordée dans le document "${documentName}"?`,
        options: [
          "L'analyse des données",
          "Les méthodes d'apprentissage",
          "La structure du document",
          "Les conclusions principales"
        ],
        correctAnswer: 1
      },
      {
        question: "Selon le document, quelle méthode est la plus efficace pour mémoriser l'information?",
        options: [
          "La répétition espacée",
          "La lecture passive",
          "L'apprentissage en une seule session",
          "La mémorisation par cœur"
        ],
        correctAnswer: 0
      },
      {
        question: "Quel concept clé est mentionné comme fondamental dans le document?",
        options: [
          "La pratique délibérée",
          "L'apprentissage collaboratif",
          "La prise de notes",
          "La visualisation"
        ],
        correctAnswer: 0
      },
      {
        question: "Quelle technique d'étude est recommandée pour les examens à long terme?",
        options: [
          "Étudier la veille de l'examen",
          "Utiliser des fiches de révision",
          "Réviser en groupe uniquement",
          "Lire le matériel une seule fois"
        ],
        correctAnswer: 1
      },
      {
        question: "Quel est l'avantage principal de la méthode décrite dans la section 3?",
        options: [
          "Elle est rapide à mettre en œuvre",
          "Elle améliore la rétention à long terme",
          "Elle ne nécessite pas de préparation",
          "Elle est facile à comprendre"
        ],
        correctAnswer: 1
      },
      {
        question: "Selon le document, quel facteur influence le plus la réussite académique?",
        options: [
          "L'intelligence innée",
          "La régularité dans le travail",
          "La chance",
          "Le soutien familial"
        ],
        correctAnswer: 1
      },
      {
        question: "Quelle stratégie cognitive est présentée comme la plus efficace?",
        options: [
          "La mémorisation passive",
          "L'auto-explication",
          "La lecture rapide",
          "L'écoute en cours"
        ],
        correctAnswer: 1
      },
      {
        question: "Quel outil numérique est recommandé pour organiser ses révisions?",
        options: [
          "Les réseaux sociaux",
          "Les applications de planification",
          "Les jeux vidéo éducatifs",
          "Les forums de discussion"
        ],
        correctAnswer: 1
      },
      {
        question: "Quelle approche est suggérée pour gérer le stress avant les examens?",
        options: [
          "Étudier davantage",
          "Pratiquer des techniques de relaxation",
          "Éviter de dormir",
          "Consommer des boissons énergisantes"
        ],
        correctAnswer: 1
      },
      {
        question: "Quel est le principe fondamental de la méthode d'apprentissage active?",
        options: [
          "Mémoriser sans comprendre",
          "Engager activement son cerveau dans le processus",
          "Étudier en groupe uniquement",
          "Éviter les pauses"
        ],
        correctAnswer: 1
      }
    ];
    
    // Return a subset of questions based on the requested count
    return {
      title: `Quiz sur ${documentName} - Questions ${difficultyFactors[difficulty]}`,
      questions: questions.slice(0, count)
    };
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
            Créez un quiz personnalisé basé sur le contenu de votre document
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="num-questions">Nombre de questions</Label>
            <Input
              id="num-questions"
              type="number"
              min="3"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
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
                >
                  {level === "easy" ? "Facile" : level === "medium" ? "Moyen" : "Difficile"}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            className="w-full mt-4"
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
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
