"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, FileUp, X, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
} from '@/components/ui/dialog';

type Material = {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'presentation';
  url: string;
  uploadedBy: string;
};

const SharedMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showSharing, setShowSharing] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, we would upload these files to a server
    // and get back URLs. For this demo, we'll create fake URLs
    const newMaterials = Array.from(files).map(file => {
      let type: 'pdf' | 'image' | 'presentation' = 'pdf';
      
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        type = 'presentation';
      }
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type,
        // In real app, this would be an actual URL from server
        url: URL.createObjectURL(file),
        uploadedBy: 'You',
      };
    });
    
    setMaterials(prev => [...prev, ...newMaterials]);
  };
  
  const openMaterial = (material: Material) => {
    setSelectedMaterial(material);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <Button 
        onClick={() => setShowSharing(true)}
        className="fixed right-4 bottom-32 rounded-full p-3 bg-blue-600 text-white"
        title="Share Materials"
      >
        <FileText size={20} />
      </Button>
      
      <Dialog open={showSharing} onOpenChange={setShowSharing}>
        <DialogContent className={`${isFullscreen ? 'w-screen h-screen max-w-none' : 'max-w-3xl'}`}>
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Shared Learning Materials</DialogTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSharing(false)}>
                <X size={18} />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            {selectedMaterial ? (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedMaterial(null)}
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back to Files
                  </Button>
                  <div className="font-medium">{selectedMaterial.name}</div>
                </div>
                
                <div className="flex-1 bg-gray-100 rounded-md overflow-hidden">
                  {selectedMaterial.type === 'image' ? (
                    <img 
                      src={selectedMaterial.url} 
                      alt={selectedMaterial.name}
                      className="max-w-full max-h-full object-contain mx-auto"
                    />
                  ) : selectedMaterial.type === 'pdf' ? (
                    <iframe 
                      src={selectedMaterial.url} 
                      className="w-full h-full border-0"
                      title={selectedMaterial.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>Preview not available for presentations. Download to view.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label>
                    <Button className="w-full">
                      <FileUp size={16} className="mr-2" /> Upload New Material
                      <Input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      />
                    </Button>
                  </label>
                </div>
                
                <div className="overflow-y-auto flex-1">
                  {materials.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText size={48} className="mx-auto mb-2 opacity-20" />
                      <p>No materials shared yet</p>
                      <p className="text-sm">Upload files to share with participants</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {materials.map(material => (
                        <div 
                          key={material.id}
                          className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => openMaterial(material)}
                        >
                          <div className="flex items-center mb-2">
                            <FileText size={18} className="mr-2 text-blue-600" />
                            <div className="text-sm font-medium truncate flex-1">
                              {material.name}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Shared by {material.uploadedBy}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SharedMaterials; 