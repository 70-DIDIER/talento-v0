import React from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Download, XCircle } from "lucide-react"; // Added XCircle
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// DocumentSummary now takes `summary` and `onClearSummary`
// The `originalText` prop can be added later if needed for display.
const DocumentSummary = ({ summary, onClearSummary }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Résumé copié",
      description: "Le résumé a été copié dans le presse-papiers.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    // Since document.name is gone, use a generic name or pass submittedText for a better name
    element.download = `resume.txt`; 
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Résumé téléchargé",
      description: "Le fichier de résumé a été téléchargé avec succès.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <CardTitle className="text-xl">Résumé du texte</CardTitle> {/* Changed title */}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
              {/* Add a button to clear the summary and go back */}
              <Button
                variant="destructive" // Or "outline"
                size="sm"
                className="flex items-center"
                onClick={onClearSummary} 
              >
                <XCircle className="h-4 w-4 mr-1" />
                Nouveau Texte
              </Button>
            </div>
          </div>
          {/* Removed document.name paragraph as document prop is gone */}
          {/* <p className="text-sm text-muted-foreground mt-2">
            Document: {document.name} 
          </p> */}
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-base leading-relaxed">
              {summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocumentSummary;
