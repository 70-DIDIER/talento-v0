
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const QuizInterface = ({ quiz, onFinish, onRestart }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const { toast } = useToast();

  const handleOptionSelect = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === quiz.questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Bonne réponse!",
        description: "Continuez comme ça!",
      });
    }
    
    setResults([...results, {
      question: quiz.questions[currentQuestion].question,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      
      // Show completion toast
      toast({
        title: "Quiz terminé!",
        description: `Votre score: ${score}/${quiz.questions.length}`,
      });
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.questions.length) * 100;
    
    if (percentage >= 90) return "Excellent! Vous maîtrisez parfaitement ce sujet!";
    if (percentage >= 70) return "Très bien! Vous avez une bonne compréhension du sujet.";
    if (percentage >= 50) return "Bien! Continuez à pratiquer pour vous améliorer.";
    return "Continuez à étudier ce sujet pour renforcer vos connaissances.";
  };

  const progressPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <AnimatePresence mode="wait">
      {!isCompleted ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="quiz-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <span className="text-sm font-medium">
                  Question {currentQuestion + 1}/{quiz.questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardHeader>
            
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">
                {quiz.questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  >
                    <button
                      className={`w-full text-left p-4 rounded-md border transition-all ${
                        selectedOption === index
                          ? index === quiz.questions[currentQuestion].correctAnswer
                            ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600"
                            : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600"
                          : "hover:bg-muted/50 border-border"
                      }`}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && selectedOption === index && (
                          index === quiz.questions[currentQuestion].correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )
                        )}
                        {isAnswered && selectedOption !== index && index === quiz.questions[currentQuestion].correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-2">
              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="flex items-center"
              >
                {currentQuestion < quiz.questions.length - 1 ? (
                  <>
                    Question suivante
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Terminer le quiz"
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Résultats du quiz</CardTitle>
              <p className="text-muted-foreground">
                Vous avez obtenu un score de {score}/{quiz.questions.length}
              </p>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-6">
                <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${(score / quiz.questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-center mt-4 font-medium">{getScoreMessage()}</p>
              </div>
              
              <div className="space-y-3 mt-6">
                <h3 className="font-medium">Résumé des réponses:</h3>
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-3 rounded-md bg-muted/50"
                  >
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{result.question}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" onClick={onRestart}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Recommencer
              </Button>
              <Button onClick={onFinish}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizInterface;
