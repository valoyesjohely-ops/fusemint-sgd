import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  fechaCarga: string;
  url: string;
}

interface DocumentViewerProps {
  documento: Documento;
  onClose: () => void;
  onDownload: () => void;
}

export default function DocumentViewer({ documento, onClose, onDownload }: DocumentViewerProps) {
  const isPDF = documento.tipo === 'application/pdf' || documento.nombre.endsWith('.pdf');
  const isImage = documento.tipo.startsWith('image/');
  const isText = documento.tipo.startsWith('text/') || documento.nombre.endsWith('.txt');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="truncate">{documento.nombre}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-secondary rounded-lg p-4">
          {isPDF ? (
            <iframe
              src={`${documento.url}#toolbar=0`}
              className="w-full h-full rounded-lg border border-border"
              title="PDF Viewer"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={documento.url}
                alt={documento.nombre}
                className="max-h-full max-w-full rounded-lg"
              />
            </div>
          ) : isText ? (
            <iframe
              src={documento.url}
              className="w-full h-full rounded-lg border border-border"
              title="Text Viewer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-6xl">📄</div>
              <p className="text-muted-foreground text-center">
                Este tipo de documento no puede ser visualizado en el navegador
              </p>
              <p className="text-sm text-muted-foreground">
                Por favor descárgalo para verlo en tu equipo
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X size={18} className="mr-2" />
            Cerrar
          </Button>
          <Button onClick={onDownload} className="bg-primary hover:bg-primary/90">
            <Download size={18} className="mr-2" />
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
