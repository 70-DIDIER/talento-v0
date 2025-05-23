import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Paperclip, Send, RefreshCw } from 'lucide-react';

const TextInputArea = ({ onTextSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="p-6 border-2 border-dashed rounded-lg border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
        <div className="space-y-2">
          <label htmlFor="text-input" className="text-lg font-medium text-primary">
            Collez votre texte ici
          </label>
          <p className="text-sm text-muted-foreground">
            Saisissez ou collez le texte que vous souhaitez résumer et sur lequel vous voulez être interrogé.
          </p>
          <Textarea
            id="text-input"
            placeholder="Commencez à taper votre texte ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !text.trim()} className="w-full">
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
            Traitement en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Soumettre le texte
          </>
        )}
      </Button>
    </div>
  );
};

export default TextInputArea;
