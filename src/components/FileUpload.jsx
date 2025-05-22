
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez télécharger un document PDF, TXT ou DOC/DOCX.",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 10MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate processing delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // In a real app, you would send the file to a server here
      // For now, we'll just simulate a successful upload
      
      setTimeout(() => {
        setUploading(false);
        onFileUpload(file);
        toast({
          title: "Document téléchargé avec succès",
          description: `${file.name} a été téléchargé et est prêt à être analysé.`,
        });
      }, 500);
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {!file ? (
        <div
          className={`file-drop-area rounded-lg p-8 text-center ${
            isDragging ? "active" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Déposez votre document ici
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Formats supportés: PDF, TXT, DOC, DOCX (max 10MB)
            </p>
            <Button
              onClick={() => fileInputRef.current.click()}
              className="mt-2"
            >
              Parcourir les fichiers
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
            />
          </motion.div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-medium text-base">{file.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={uploading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {progress === 100 ? (
                  <span className="flex items-center justify-center">
                    Traitement terminé <Check className="ml-1 h-4 w-4 text-green-500" />
                  </span>
                ) : (
                  `Téléchargement en cours... ${progress}%`
                )}
              </p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              Analyser le document
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FileUpload;
