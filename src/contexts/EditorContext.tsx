// ============================================
// PRIMEIROCV - CONTEXTO DO EDITOR
// ============================================

import { createContext, useContext, type ReactNode } from 'react';
import { useResumeEditor } from '@/pages/Editor/hooks';

type ResumeEditorReturn = ReturnType<typeof useResumeEditor>;

const EditorContext = createContext<ResumeEditorReturn | null>(null);

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const editor = useResumeEditor();
  
  return (
    <EditorContext.Provider value={editor}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext(): ResumeEditorReturn {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
}
