"use client";

import { useEffect, useRef, useState } from 'react';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Palette, X, Trash2, Pencil, Eraser } from 'lucide-react';

type StrokeEvent = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'start' | 'draw' | 'end';
};

const InteractiveWhiteboard = () => {
  const call = useCall();
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    
    // Initialize canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup canvas dimensions properly for high DPI displays
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(2, 2);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;
    }
  }, [isOpen]);

  // Listen for incoming custom events
  useEffect(() => {
    if (!call || !isOpen) return;
    
    const unsubscribe = call.on('custom', (event: any) => {
      // Handle whiteboard draw events
      if (event.custom?.type === 'whiteboard-draw') {
        const payload = event.custom.data as StrokeEvent;
        const ctx = contextRef.current;
        if (!ctx) return;
        
        // Match the sender's brush settings
        ctx.strokeStyle = payload.color;
        ctx.lineWidth = payload.size;
        
        if (payload.type === 'start') {
          ctx.beginPath();
          ctx.moveTo(payload.x, payload.y);
        } else if (payload.type === 'draw') {
          ctx.lineTo(payload.x, payload.y);
          ctx.stroke();
        } else if (payload.type === 'end') {
          ctx.closePath();
        }
      }
      
      // Handle canvas clear event
      if (event.custom?.type === 'whiteboard-clear') {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });

    return () => unsubscribe();
  }, [call, isOpen]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = contextRef.current;
    if (!ctx) return;
    
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#1f2937' : color; // Try to match background if eraser (or use globalCompositeOperation)
    if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = isEraser ? 30 : brushSize;
    
    call?.sendCustomEvent({
      type: 'whiteboard-draw',
      data: { id: Date.now().toString(), x, y, color: ctx.strokeStyle, size: ctx.lineWidth, type: 'start' }
    }).catch(console.error);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    
    const { x, y } = getCoordinates(e);
    const ctx = contextRef.current;
    if (!ctx) return;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    call?.sendCustomEvent({
      type: 'whiteboard-draw',
      data: { id: Date.now().toString(), x, y, color: ctx.strokeStyle, size: ctx.lineWidth, type: 'draw' }
    }).catch(console.error);
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    
    const ctx = contextRef.current;
    if (ctx) ctx.closePath();
    isDrawing.current = false;
    
    call?.sendCustomEvent({
      type: 'whiteboard-draw',
      data: { id: Date.now().toString(), x: 0, y: 0, color: '', size: 0, type: 'end' }
    }).catch(console.error);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    call?.sendCustomEvent({
      type: 'whiteboard-clear'
    }).catch(console.error);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed right-[80px] bottom-28 rounded-full p-3 bg-purple-700 hover:bg-purple-600 text-white shadow-md transition-colors z-[100]"
        title="Open Interactive Whiteboard"
      >
        <Palette size={20} />
      </Button>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 text-white shadow-2xl z-50 rounded-xl overflow-hidden flex flex-col"
         style={{ width: '80vw', height: '80vh', maxWidth: '1000px', maxHeight: '800px' }}>
      
      {/* Header / Tools */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800">
        <h3 className="font-medium flex items-center gap-2">
          <Palette size={18} className="text-purple-400" />
          Interactive Whiteboard
        </h3>
        
        <div className="flex items-center gap-4 border-l pl-4 border-gray-700">
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400">Color:</span>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => { setColor(e.target.value); setIsEraser(false); }}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              title="Brush Color"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400">Size:</span>
            <input 
              type="range" 
              min="1" max="20" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-purple-500"
            />
          </div>

          <div className="flex bg-gray-700 rounded-md p-1 gap-1 border border-gray-600">
            <button 
              className={`p-1.5 rounded ${!isEraser ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setIsEraser(false)}
              title="Pen"
            >
              <Pencil size={14} />
            </button>
            <button 
              className={`p-1.5 rounded ${isEraser ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setIsEraser(true)}
              title="Eraser"
            >
              <Eraser size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearCanvas} className="h-8 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300">
            <Trash2 size={14} className="mr-1.5" /> Clear All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0 rounded-full hover:bg-gray-700 text-gray-300">
            <X size={16} />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-grow w-full h-full relative bg-gray-800/50 cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 block"
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;
