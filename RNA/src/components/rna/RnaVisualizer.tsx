
import { useEffect, useRef, useState } from "react";

// This is a placeholder 3D visualization component
// In a real-world scenario, this would use a 3D library like Three.js
const RnaVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simulate loading the 3D model
    const timer = setTimeout(() => {
      setIsLoading(false);
      drawPlaceholderVisualization(ctx, canvas.width, canvas.height);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const drawPlaceholderVisualization = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw a simple RNA-like structure
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // Draw the backbone
    ctx.beginPath();
    ctx.moveTo(100, height/2);
    
    // Create a somewhat random but RNA-like path
    let x = 100;
    const increment = (width - 200) / 15;
    
    for (let i = 0; i < 15; i++) {
      x += increment;
      const y = height/2 + Math.sin(i * 0.4) * 80;
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    
    // Draw nucleotides as colored circles
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316'];
    x = 100;
    
    for (let i = 0; i < 15; i++) {
      x += increment;
      const y = height/2 + Math.sin(i * 0.4) * 80;
      
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % 4];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Add some hydrogen bond lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    
    for (let i = 0; i < 7; i++) {
      const startX = 100 + increment * (i + 1);
      const startY = height/2 + Math.sin(i * 0.4) * 80;
      const endX = 100 + increment * (14 - i);
      const endY = height/2 + Math.sin((14 - i) * 0.4) * 80;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    
    // Add some labels
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('5′', 80, height/2 + 5);
    ctx.fillText('3′', width - 80, height/2 + 5);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[500px] border rounded-lg bg-background relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg font-medium">Loading 3D model...</span>
        </div>
      ) : (
        <>
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="max-w-full h-auto"
          />
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
            Note: This is a simplified visualization. For detailed interactive 3D models, 
            we recommend exporting the data for use in specialized molecular visualization software.
          </div>
        </>
      )}
    </div>
  );
};

export default RnaVisualizer;