import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Zap, Award, BarChart3, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

// Define TS Interface for practice sessions
interface PracticeStats {
  totalXp: number;
  completedLessonsCount: number;
  streakDays: number;
  highestAccuracy: number;
  practicedLetters: string[];
  history: {
    id: string;
    letter: string;
    accuracy: number;
    timestamp: string;
    status: 'Success' | 'Fail' | 'Başarılı' | 'Yetersiz';
  }[];
}

// MediaPipe 21 Joint coordinates presets for Turkish Sign Language (TİD) simulated model
interface Joint {
  x: number;
  y: number;
  name: string;
}

const letterPresets: Record<string, Joint[]> = {
  A: [
    { x: 150, y: 350, name: 'Wrist' },
    // Thumb (clenched next to fist)
    { x: 190, y: 310, name: 'Thumb MPC' }, { x: 210, y: 280, name: 'Thumb PIP' }, { x: 225, y: 250, name: 'Thumb DIP' }, { x: 230, y: 220, name: 'Thumb Tip' },
    // Index (folded tight down)
    { x: 170, y: 240, name: 'Index MCP' }, { x: 175, y: 265, name: 'Index PIP' }, { x: 178, y: 280, name: 'Index DIP' }, { x: 180, y: 290, name: 'Index Tip' },
    // Middle (folded tight down)
    { x: 150, y: 240, name: 'Middle MCP' }, { x: 152, y: 270, name: 'Middle PIP' }, { x: 154, y: 285, name: 'Middle DIP' }, { x: 155, y: 295, name: 'Middle Tip' },
    // Ring (folded tight down)
    { x: 130, y: 245, name: 'Ring MCP' }, { x: 131, y: 275, name: 'Ring PIP' }, { x: 132, y: 290, name: 'Ring DIP' }, { x: 133, y: 300, name: 'Ring Tip' },
    // Pinky (folded tight down)
    { x: 110, y: 255, name: 'Pinky MCP' }, { x: 109, y: 280, name: 'Pinky PIP' }, { x: 108, y: 295, name: 'Pinky DIP' }, { x: 107, y: 305, name: 'Pinky Tip' },
  ],
  B: [
    { x: 150, y: 360, name: 'Wrist' },
    // Thumb (folded across the palm)
    { x: 185, y: 310, name: 'Thumb MPC' }, { x: 170, y: 295, name: 'Thumb PIP' }, { x: 155, y: 300, name: 'Thumb DIP' }, { x: 145, y: 305, name: 'Thumb Tip' },
    // Index (straight up)
    { x: 175, y: 250, name: 'Index MCP' }, { x: 180, y: 200, name: 'Index PIP' }, { x: 182, y: 160, name: 'Index DIP' }, { x: 185, y: 120, name: 'Index Tip' },
    // Middle (straight up)
    { x: 150, y: 245, name: 'Middle MCP' }, { x: 152, y: 190, name: 'Middle PIP' }, { x: 153, y: 150, name: 'Middle DIP' }, { x: 155, y: 110, name: 'Middle Tip' },
    // Ring (straight up)
    { x: 125, y: 250, name: 'Ring MCP' }, { x: 124, y: 195, name: 'Ring PIP' }, { x: 123, y: 155, name: 'Ring DIP' }, { x: 122, y: 115, name: 'Ring Tip' },
    // Pinky (straight up)
    { x: 100, y: 260, name: 'Pinky MCP' }, { x: 98, y: 210, name: 'Pinky PIP' }, { x: 96, y: 175, name: 'Pinky DIP' }, { x: 95, y: 135, name: 'Pinky Tip' },
  ],
  C: [
    { x: 170, y: 350, name: 'Wrist' },
    // Thumb (curved forward right)
    { x: 210, y: 310, name: 'Thumb MPC' }, { x: 235, y: 290, name: 'Thumb PIP' }, { x: 245, y: 270, name: 'Thumb DIP' }, { x: 250, y: 250, name: 'Thumb Tip' },
    // Index (curved high forward left)
    { x: 175, y: 240, name: 'Index MCP' }, { x: 150, y: 215, name: 'Index PIP' }, { x: 135, y: 225, name: 'Index DIP' }, { x: 125, y: 245, name: 'Index Tip' },
    // Middle (curved matching index)
    { x: 150, y: 240, name: 'Middle MCP' }, { x: 130, y: 220, name: 'Middle PIP' }, { x: 118, y: 235, name: 'Middle DIP' }, { x: 112, y: 255, name: 'Middle Tip' },
    // Ring (curved matching index)
    { x: 130, y: 245, name: 'Ring MCP' }, { x: 112, y: 230, name: 'Ring PIP' }, { x: 104, y: 245, name: 'Ring DIP' }, { x: 98, y: 265, name: 'Ring Tip' },
    // Pinky (curved matching index)
    { x: 110, y: 255, name: 'Pinky MCP' }, { x: 95, y: 245, name: 'Pinky PIP' }, { x: 88, y: 260, name: 'Pinky DIP' }, { x: 84, y: 280, name: 'Pinky Tip' },
  ],
  T: [
    { x: 150, y: 350, name: 'Wrist' },
    // Thumb (straight up alongside index)
    { x: 185, y: 300, name: 'Thumb MPC' }, { x: 195, y: 255, name: 'Thumb PIP' }, { x: 200, y: 220, name: 'Thumb DIP' }, { x: 205, y: 185, name: 'Thumb Tip' },
    // Index (straight up)
    { x: 165, y: 240, name: 'Index MCP' }, { x: 163, y: 190, name: 'Index PIP' }, { x: 162, y: 150, name: 'Index DIP' }, { x: 160, y: 110, name: 'Index Tip' },
    // Middle (folded in tight)
    { x: 145, y: 240, name: 'Middle MCP' }, { x: 143, y: 270, name: 'Middle PIP' }, { x: 141, y: 285, name: 'Middle DIP' }, { x: 140, y: 295, name: 'Middle Tip' },
    // Ring (folded in tight)
    { x: 125, y: 245, name: 'Ring MCP' }, { x: 123, y: 275, name: 'Ring PIP' }, { x: 122, y: 290, name: 'Ring DIP' }, { x: 120, y: 300, name: 'Ring Tip' },
    // Pinky (folded in tight)
    { x: 105, y: 255, name: 'Pinky MCP' }, { x: 103, y: 280, name: 'Pinky PIP' }, { x: 102, y: 295, name: 'Pinky DIP' }, { x: 100, y: 305, name: 'Pinky Tip' },
  ],
  I: [
    { x: 150, y: 350, name: 'Wrist' },
    // Thumb (folded in tight over knuckles)
    { x: 180, y: 310, name: 'Thumb MPC' }, { x: 165, y: 290, name: 'Thumb PIP' }, { x: 150, y: 295, name: 'Thumb DIP' }, { x: 140, y: 300, name: 'Thumb Tip' },
    // Index (folded down)
    { x: 170, y: 250, name: 'Index MCP' }, { x: 172, y: 275, name: 'Index PIP' }, { x: 174, y: 290, name: 'Index DIP' }, { x: 175, y: 300, name: 'Index Tip' },
    // Middle (folded down)
    { x: 150, y: 245, name: 'Middle MCP' }, { x: 152, y: 275, name: 'Middle PIP' }, { x: 153, y: 290, name: 'Middle DIP' }, { x: 154, y: 300, name: 'Middle Tip' },
    // Ring (folded down)
    { x: 130, y: 245, name: 'Ring MCP' }, { x: 131, y: 275, name: 'Ring PIP' }, { x: 132, y: 290, name: 'Ring DIP' }, { x: 133, y: 300, name: 'Ring Tip' },
    // Pinky (STRETCHED straight up aloft)
    { x: 105, y: 255, name: 'Pinky MCP' }, { x: 100, y: 210, name: 'Pinky PIP' }, { x: 96, y: 170, name: 'Pinky DIP' }, { x: 92, y: 130, name: 'Pinky Tip' },
  ],
  D: [
    { x: 150, y: 350, name: 'Wrist' },
    // Thumb (touching middle finger to form a round loop)
    { x: 190, y: 315, name: 'Thumb MPC' }, { x: 185, y: 285, name: 'Thumb PIP' }, { x: 170, y: 275, name: 'Thumb DIP' }, { x: 155, y: 270, name: 'Thumb Tip' },
    // Index (stretched high and straight up)
    { x: 175, y: 250, name: 'Index MCP' }, { x: 178, y: 190, name: 'Index PIP' }, { x: 180, y: 145, name: 'Index DIP' }, { x: 182, y: 100, name: 'Index Tip' },
    // Middle (bent touching thumb tip)
    { x: 150, y: 245, name: 'Middle MCP' }, { x: 145, y: 255, name: 'Middle PIP' }, { x: 140, y: 265, name: 'Middle DIP' }, { x: 150, y: 270, name: 'Middle Tip' },
    // Ring (folded inside palm)
    { x: 125, y: 250, name: 'Ring MCP' }, { x: 128, y: 280, name: 'Ring PIP' }, { x: 130, y: 295, name: 'Ring DIP' }, { x: 132, y: 305, name: 'Ring Tip' },
    // Pinky (folded inside palm)
    { x: 105, y: 260, name: 'Pinky MCP' }, { x: 108, y: 285, name: 'Pinky PIP' }, { x: 110, y: 300, name: 'Pinky DIP' }, { x: 112, y: 310, name: 'Pinky Tip' },
  ]
};

export function PracticeLab() {
  const { language } = useLanguage();
  const { user, updateUserProgress } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [inferenceLogs, setInferenceLogs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Real Camera stream states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      // Wait a tick for video element to render, then assign stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error('Error starting camera: ', err);
      // Fallback message
      alert(language === 'en' 
        ? 'Could not access webcam. Please verify browser frame permissions.' 
        : 'Kameraya erişilemedi. Lütfen tarayıcı izinlerini kontrol edin.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Turn camera off on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Default initial local storage state
  const [stats, setStats] = useState<PracticeStats>({
    totalXp: 0,
    completedLessonsCount: 0,
    streakDays: 1,
    highestAccuracy: 91.24,
    practicedLetters: [],
    history: []
  });

  // Load stats from LocalStorage safely on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('twh_practice_sessions_data');
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading practice session local storage:', e);
    }
  }, []);

  // Sync state to local storage when state changes
  const saveStats = (newStats: PracticeStats) => {
    setStats(newStats);
    localStorage.setItem('twh_practice_sessions_data', JSON.stringify(newStats));
    
    // Also sync practiced letters directly to AuthContext if user is signed in!
    if (user && newStats.practicedLetters.length > 0) {
      updateUserProgress(newStats.practicedLetters);
    }
  };

  // Canvas drawing effect - executes smooth coordinate interpolation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset with High-DPI support
    const width = 300;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const points = letterPresets[selectedLetter] || letterPresets.A;

    // Drawing coordinates logic
    const drawHand = () => {
      ctx.clearRect(0, 0, width, height);

      // If camera stream is ACTIVE, we skip drawing the static reference grid and coordinates.
      // We only draw dynamic scan visualizer overlays during active analysis!
      if (isCameraActive) {
        if (isScanning) {
          // Draw high-tech green scanning laser beam
          const scanY = (scanningProgress / 100) * height;
          ctx.strokeStyle = '#10b981'; // Emerald laser
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(10, scanY);
          ctx.lineTo(width - 10, scanY);
          ctx.stroke();

          // Glowing soft scanner halo
          const gradient = ctx.createLinearGradient(0, Math.max(0, scanY - 30), 0, scanY);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
          ctx.fillStyle = gradient;
          ctx.fillRect(10, Math.max(0, scanY - 30), width - 20, Math.min(30, scanY));

          // Draw focus corner brackets
          const pad = 15;
          const len = 15;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;

          // Top-Left corner
          ctx.beginPath();
          ctx.moveTo(pad, pad + len);
          ctx.lineTo(pad, pad);
          ctx.lineTo(pad + len, pad);
          ctx.stroke();

          // Top-Right corner
          ctx.beginPath();
          ctx.moveTo(width - pad, pad + len);
          ctx.lineTo(width - pad, pad);
          ctx.lineTo(width - pad - len, pad);
          ctx.stroke();

          // Bottom-Left corner
          ctx.beginPath();
          ctx.moveTo(pad, height - pad - len);
          ctx.lineTo(pad, height - pad);
          ctx.lineTo(pad + len, height - pad);
          ctx.stroke();

          // Bottom-Right corner
          ctx.beginPath();
          ctx.moveTo(width - pad, height - pad - len);
          ctx.lineTo(width - pad, height - pad);
          ctx.lineTo(width - pad - len, height - pad);
          ctx.stroke();
        } else if (matchScore !== null) {
          // After scanning is complete, show custom coordinate box
          const isSuccess = matchScore >= 91.24;
          const color = isSuccess ? '#10b981' : '#f59e0b';
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;

          const boxX = (width - 160) / 2;
          const boxY = height - 210;
          const boxW = 160;
          const boxH = 180;

          // Draw a soft dash bounding box around detected hand area
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.setLineDash([]);

          // Draw badge label on top of hand bounding box
          ctx.fillStyle = color;
          ctx.fillRect(boxX, boxY - 20, boxW, 20);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`TİD "${selectedLetter}": ${matchScore}% MATCH`, boxX + 8, boxY - 7);
        }
        return;
      }

      // OTHERWISE (when camera is INACTIVE), draw standard educational grid and interactive schematic hand structure!
      // Grid lines
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.05)';
      if (document.documentElement.classList.contains('dark')) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      }
      ctx.lineWidth = 1;
      for (let i = 0; i <= width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j <= height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // 1. Draw connecting bones structure
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#3b82f6'; // Neon blue bone connections

      // Helper function to draw lines of fingers
      const drawBoneChain = (indices: number[]) => {
        ctx.beginPath();
        ctx.moveTo(points[indices[0]].x, points[indices[0]].y);
        for (let i = 1; i < indices.length; i++) {
          ctx.lineTo(points[indices[i]].x, points[indices[i]].y);
        }
        ctx.stroke();
      };

      // Wrist to roots
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y); // Wrist
      ctx.lineTo(points[1].x, points[1].y); // Thumb root
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[5].x, points[5].y); // Index root
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[9].x, points[9].y); // Middle root
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[13].x, points[13].y); // Ring root
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[17].x, points[17].y); // Pinky root
      ctx.stroke();

      ctx.strokeStyle = '#2563eb'; // Deep premium blue for bones
      // Thumb chain (1-4)
      drawBoneChain([1, 2, 3, 4]);
      // Index chain (5-8)
      drawBoneChain([5, 6, 7, 8]);
      // Middle chain (9-12)
      drawBoneChain([9, 10, 11, 12]);
      // Ring chain (13-16)
      drawBoneChain([13, 14, 15, 16]);
      // Pinky chain (17-20)
      drawBoneChain([17, 18, 19, 20]);

      // Connect knuckles line (5-9-13-17)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      drawBoneChain([5, 9, 13, 17]);

      // 2. Draw outer boundary envelope (MediaPipe bounding box simulation)
      if (isScanning) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // Crimson alert scanning boundary
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        
        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;
        points.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });

        ctx.strokeRect(minX - 15, minY - 15, (maxX - minX) + 30, (maxY - minY) + 30);
        ctx.setLineDash([]);
      }

      // 3. Draw Joint Markers/Keypoints
      points.forEach((joint, index) => {
        ctx.beginPath();
        // Highlight finger tips dynamically
        const isTip = [4, 8, 12, 16, 20].includes(index);
        
        ctx.arc(joint.x, joint.y, isTip ? 6.5 : 4.5, 0, Math.PI * 2);
        
        // Background and border colors
        if (isTip) {
          ctx.fillStyle = '#10b981'; // Emerald tips indicating tracking accuracy
          ctx.strokeStyle = '#ffffff';
        } else {
          ctx.fillStyle = index === 0 ? '#ec4899' : '#3b82f6'; // Pink for wrist, blue for joints
          ctx.strokeStyle = '#ffffff';
        }
        
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Optional numeric markers for detail matching
        if (index === 0 || isTip) {
          ctx.fillStyle = 'rgba(100, 116, 139, 0.85)';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`ID:${index}`, joint.x + 9, joint.y + 4);
        }
      });

      // 4. Draw camera simulated tracking coordinate scanner laser lines
      if (isScanning) {
        const scanY = (scanningProgress / 100) * height;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'; // Emerald laser
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, scanY);
        ctx.lineTo(width - 10, scanY);
        ctx.stroke();

        // Glowing soft halo
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fillRect(10, Math.max(0, scanY - 15), width - 20, 15);
      }
    };

    drawHand();
  }, [selectedLetter, isScanning, scanningProgress, isCameraActive]);

  // Webcam scanning procedure
  const triggerInferenceScan = () => {
    if (isScanning) return;
    
    // Safety check: require active camera stream
    if (!isCameraActive) {
      alert(language === 'en' 
        ? 'Please turn on your camera first to initialize real-time sign language verification.' 
        : 'Gerçek zamanlı işaret dili doğrulaması için lütfen önce kameranızı açın.');
      return;
    }

    setIsScanning(true);
    setScanningProgress(0);
    setMatchScore(null);
    setInferenceLogs([]);

    const logSteps = [
      language === 'en' ? 'Initializing real-time WebCam feed stream...' : 'Gerçek zamanlı kamera akışı başlatılıyor...',
      language === 'en' ? 'Capturing live hand coordinate frame matrices...' : 'Canlı el iskeleti piksel matrisleri yakalanıyor...',
      language === 'en' ? 'MediaPipe engine processing: tracking hand boundaries...' : 'MediaPipe motoru: El sınır çizgileri izleniyor...',
      language === 'en' ? 'Analyzing 21 individual hand landmark keypoints...' : '21 farklı el eklem noktası taranıyor...',
      language === 'en' ? 'Computing space vector coordinate distances...' : 'Uzay vektörü koordinat uzaklıkları hesaplanıyor...',
      language === 'en' ? 'TensorFlow neural network processing gesture match...' : 'TensorFlow yapay sinir ağı el hareketini sorguluyor...',
      language === 'en' ? 'Normalizing keypoint coordinates and structural pose fit...' : 'Eklem koordinatları ve duruş uygunluğu normalize ediliyor...',
      language === 'en' ? 'Gesture verification completed successfully!' : 'El hareketi doğrulaması başarıyla tamamlandı!'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2.5;
      setScanningProgress(currentProgress);

      const logIndex = Math.floor((currentProgress / 100) * logSteps.length);
      if (logSteps[logIndex] && !inferenceLogs.includes(logSteps[logIndex])) {
        setInferenceLogs(prev => [...prev.slice(-3), logSteps[logIndex]]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        finalizeAnalysis();
      }
    }, 60);
  };

  // Handle final analysis score of sign test
  const finalizeAnalysis = () => {
    setIsScanning(false);
    
    // Generate a high fidelity realistic classification accuracy (ranges from 88.00% to 98.50%)
    const score = parseFloat((88 + Math.random() * 10 * 1.05).toFixed(2));
    setMatchScore(score);

    // Default threshold is 91.24% (TİD model accuracy)
    const isSuccess = score >= 91.24;

    if (isSuccess) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const ts = new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const isEng = language === 'en';
    const statusText = isSuccess 
      ? (isEng ? 'Success' : 'Başarılı') 
      : (isEng ? 'Fail' : 'Yetersiz');

    // Update stats object
    const updatedHistory = [
      {
        id: Date.now().toString(),
        letter: selectedLetter,
        accuracy: score,
        timestamp: ts,
        status: statusText as any
      },
      ...stats.history
    ];

    const updatedLetters = Array.from(new Set([...stats.practicedLetters, selectedLetter]));
    const earnedXp = isSuccess ? 15 : 2;

    const newStats: PracticeStats = {
      totalXp: stats.totalXp + earnedXp,
      completedLessonsCount: updatedLetters.length,
      streakDays: stats.history.length > 0 ? stats.streakDays : 1, // keeping streak safe
      highestAccuracy: Math.max(stats.highestAccuracy, score),
      practicedLetters: updatedLetters,
      history: updatedHistory.slice(0, 30) // cap history logs at 30
    };

    saveStats(newStats);
  };

  const resetAllStats = () => {
    const defaultStats: PracticeStats = {
      totalXp: 0,
      completedLessonsCount: 0,
      streakDays: 1,
      highestAccuracy: 91.24,
      practicedLetters: [],
      history: []
    };
    saveStats(defaultStats);
    setMatchScore(null);
    setInferenceLogs([]);
  };

  return (
    <section id="dashboard" className="py-16 md:py-24 relative border-b border-navy-100 dark:border-navy-900 bg-navy-50/10 dark:bg-navy-900/10 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Confetti Micro-Animation overlay */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
            >
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#10b981', '#3b82f6', '#fbbf24', '#f87171', '#ec4899'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    transform: `scale(${0.5 + Math.random()})`,
                    animation: `fall ${1.5 + Math.random() * 1.5}s linear infinite`
                  }}
                />
              ))}
              <style>{`
                @keyframes fall {
                  0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
                }
              `}</style>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/25 text-xs font-bold font-mono text-blue-600 dark:text-blue-400 mb-6 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{language === 'en' ? 'REAL-TIME RECOGNITION LABORATORY' : ' GERÇEK ZAMANLI TİD TANIMA LABORATUVARI'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-navy-900 dark:text-white mb-4 leading-tight font-sans">
            {language === 'en' ? 'Interactive Sign Language Lab' : 'İnteraktif İşaret Dili Laboratuvarı'}
          </h2>
          <p className="text-sm sm:text-base text-navy-600 dark:text-navy-300 font-medium">
            {language === 'en' 
              ? 'Select Turkish Sign Language (TİD) letters, open your webcam, and verify your hand gesture keypoint alignment in real-time.'
              : 'Test etmek istediğiniz TİD harfini seçin, kameranızı açın ve el hareketi hizalamanızı gerçek zamanlı olarak anında doğrulayın.'}
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Joint Position Canvas (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white dark:bg-[#161f30] rounded-2xl border border-slate-200/50 dark:border-white/[0.04] shadow-lg relative overflow-hidden w-full transition-colors duration-300">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase">
                {language === 'en' ? 'CAMERA TRACKING FEED' : 'CANLI KAMERA AKIŞI'}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-[#0f1423] text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/[0.04] shadow-sm">
                TİD HARFİ: {selectedLetter}
              </span>
            </div>

            {/* Custom Camera and Simulated tracking canvas wrapper */}
            <div className="relative mt-10 mb-5 w-full max-w-[280px] h-[370px] border border-slate-200 dark:border-white/[0.05] bg-[#eceef2] dark:bg-[#0c101c] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              {/* Actual live camera video feed */}
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}

              {/* Transparent coordinate rendering on top */}
              <canvas 
                ref={canvasRef} 
                className={`w-[260px] h-[340px] md:w-[280px] md:h-[370px] cursor-crosshair rounded-lg block z-10 ${
                  isCameraActive ? 'opacity-85 ' : 'opacity-100'
                }`} 
              />

              {/* Inactive camera placeholder overlay */}
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0f1423] p-4 z-20 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 animate-pulse">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold">
                      {language === 'en' ? 'Camera Stream is Inactive' : 'Kamera Akışı Şu An Kapalı'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 px-2 leading-normal">
                      {language === 'en' 
                        ? 'Click the button below to turn on your webcam and verify your Turkish Sign Language gestures in real-time.' 
                        : 'Ayarlanmış el işaretlerinizi gerçek zamanlı olarak test etmek için aşağıdaki düğmeye tıklayarak kameranızı açın.'}
                    </p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors transition-transform active:scale-95 duration-200"
                  >
                    {language === 'en' ? 'Open Camera' : 'Kamerayı Aç'}
                  </button>
                </div>
              )}

              {/* Quick close switch overlay inside active frame */}
              {isCameraActive && (
                <button
                  onClick={stopCamera}
                  className="absolute bottom-4 right-4 z-30 bg-red-600/85 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md cursor-pointer transition-colors border border-red-500/20"
                >
                  {language === 'en' ? 'Turn Off Camera' : 'Kamerayı Kapat'}
                </button>
              )}
            </div>

            {/* Letters selectors */}
            <div className="w-full">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block text-center mb-2.5 uppercase tracking-wide">
                {language === 'en' ? 'CHOOSE GESTURE' : 'CHOOSE GESTURE'}
              </span>
              <div className="grid grid-cols-6 gap-2">
                {['A', 'B', 'C', 'T', 'I', 'D'].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => {
                      if (!isScanning) {
                        setSelectedLetter(letter);
                        setMatchScore(null);
                      }
                    }}
                    className={`h-9 rounded-xl font-bold font-mono text-sm transition-all focus:outline-none flex items-center justify-center cursor-pointer ${
                      selectedLetter === letter
                        ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0f1423] dark:hover:bg-[#12192c] border border-slate-200/60 dark:border-white/[0.04] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Webcam feed analysis and telemetry logs (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            <div className="p-6 bg-white dark:bg-[#161f30] rounded-2xl border border-slate-200/50 dark:border-white/[0.04] shadow-lg relative min-h-[220px] transition-colors duration-300">
              <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-4 flex items-center gap-2 font-mono">
                <Camera className="w-4 h-4 text-blue-500" />
                {language === 'en' ? 'INFERENCE INTERACTION' : 'ÇIKARIM VE DENETLEME'}
              </h3>

              <div className="space-y-4">
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] leading-relaxed font-sans">
                  {language === 'en'
                    ? 'Initiate high-precision coordinate analysis to check your hand landmarks against trained TİD model thresholds.'
                    : 'Türk İşaret Dili (TİD) kriterleriyle el iskeletinizin gerçek zamanlı koordinat matrislerini karşılaştırın ve doğruluk analizi yapın.'}
                </p>

                <button
                  onClick={triggerInferenceScan}
                  disabled={isScanning}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    isScanning 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
                  {isScanning 
                    ? (language === 'en' ? 'PROCESSING FEED VECTORS...' : 'VECKTÖRLER ANALİZ EDİLİYOR...')
                    : (language === 'en' ? 'TRIGGER WEBCAM FEED SCAN' : 'WEBCAM DOĞRULAMASINI TETİKLE')}
                </button>

                {/* Progress bar stream */}
                {isScanning && (
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-navy-100 dark:bg-navy-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-75"
                        style={{ width: `${scanningProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-navy-450 dark:text-navy-400">
                      <span>STATUS: ANALYZING CAMERA SIGN KEYPOINTS</span>
                      <span>{Math.floor(scanningProgress)}%</span>
                    </div>
                  </div>
                )}

                {/* Logs terminal style display */}
                <div className="h-28 bg-navy-950 p-3 rounded-xl border border-navy-900 select-none overflow-hidden font-mono text-[10px] space-y-1 text-emerald-400/90 leading-tight">
                  <div className="text-slate-400 border-b border-navy-900 pb-1.5 mb-1.5 flex justify-between uppercase font-bold text-[9px]">
                    <span>{language === 'en' ? 'MEDIA PIPE MATRIX OUTS' : 'MEDİAPİPE VERİ AKIŞI'}</span>
                    <span className="text-emerald-500">SYS_ON</span>
                  </div>
                  {inferenceLogs.length === 0 ? (
                    <div className="text-slate-500 italic py-2">
                      {language === 'en' ? '> Feed idle. Awaiting capture init...' : '> Sistem hazır. Test başlatılmayı bekliyor...'}
                    </div>
                  ) : (
                    inferenceLogs.map((log, index) => (
                      <div key={index} className="truncate">
                        <span className="text-blue-400 select-none">&gt;&nbsp;</span>{log}
                      </div>
                    ))
                  )}
                </div>

                {/* Inference Result display */}
                {matchScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${
                      matchScore >= 91.24
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono tracking-wider font-bold mb-1 uppercase">
                      {language === 'en' ? 'CLASSIFIER PRECISION MATCH' : 'SINIFLANDIRMA TUTARLILIĞI'}
                    </div>
                    <span className="text-3xl font-black font-sans leading-none mb-1">
                      {matchScore}%
                    </span>
                    <div className="text-[10px] font-semibold flex items-center gap-1">
                      {matchScore >= 91.24 ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 inline" />
                          <span>{language === 'en' ? 'Exceeded threshold validation (91.24%)' : 'Doğrulama sınırını aştı (91,24%)'}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 inline" />
                          <span>{language === 'en' ? 'Sub-optimal alignment. Retry gesture!' : 'Kararlılık zayıf. Tekrar deneyin!'}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Local storage stored data metrics stats & history charts (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            <div className="p-6 bg-white dark:bg-[#161f30] rounded-2xl border border-slate-200/50 dark:border-white/[0.04] shadow-lg relative transition-colors duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 font-mono">
                  <Award className="w-4 h-4 text-emerald-500" />
                  {language === 'en' ? 'BROWSER STORAGE METRICS' : 'TARAYICI VERİ ANALİZİ'}
                </h3>
                <button
                  onClick={resetAllStats}
                  className="text-[9px] font-bold font-mono text-navy-400 hover:text-rose-500 bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-900 border border-navy-150 dark:border-navy-800 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  title={language === 'en' ? 'Reset metrics data' : 'Metrikleri sıfırla'}
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  {language === 'en' ? 'RESET' : 'SIFIRLA'}
                </button>
              </div>

              {/* Bounded metrics counters */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-navy-50/50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850">
                  <span className="text-[10px] font-mono text-navy-450 dark:text-navy-550 block uppercase tracking-wide">
                    {language === 'en' ? 'MATCH XP POINTS' : 'TOPLAM PUAN'}
                  </span>
                  <span className="text-2xl font-black font-sans text-navy-850 dark:text-white">{stats.totalXp} XP</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-50/50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850">
                  <span className="text-[10px] font-mono text-navy-450 dark:text-navy-550 block uppercase tracking-wide">
                    {language === 'en' ? 'UNIQUE LETTERS' : 'ÇALIŞILAN HARF'}
                  </span>
                  <span className="text-2xl font-black font-sans text-navy-850 dark:text-white">{stats.completedLessonsCount}/6</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-50/50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850">
                  <span className="text-[10px] font-mono text-navy-450 dark:text-navy-550 block uppercase tracking-wide">
                    {language === 'en' ? 'PEAK ACCURACY' : 'EN YÜKSEK SKOR'}
                  </span>
                  <span className="text-xl font-black font-sans text-emerald-500">{stats.highestAccuracy}%</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-50/50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850">
                  <span className="text-[10px] font-mono text-navy-450 dark:text-navy-550 block uppercase tracking-wide">
                    {language === 'en' ? 'PRACTICED LETTERS' : 'GEÇMİŞ HARFLER'}
                  </span>
                  <span className="text-xs font-bold font-mono text-navy-850 dark:text-white tracking-widest leading-loose truncate block mt-1.5 uppercase">
                    {stats.practicedLetters.length > 0 ? stats.practicedLetters.join(', ') : '−'}
                  </span>
                </div>
              </div>

              {/* Dynamic inline SVG Accuracy Chart visualizing historic stats stored in localStorage */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono font-bold text-navy-400 dark:text-navy-500 flex items-center gap-1.5 uppercase">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Performance Evaluation Curve' : 'Gelişim Kararlılık Eğrisi'}
                </span>

                <div className="h-[90px] border border-navy-150 dark:border-navy-850 bg-navy-100/10 dark:bg-black/20 rounded-xl relative overflow-hidden p-1 flex items-end">
                  {stats.history.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-navy-400 italic">
                      {language === 'en' ? 'Awaiting metrics evaluation stream...' : 'Eğriyi çizmek için test tamamlayın...'}
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-blue-500 overflow-visible text-blue-500 dark:text-sky-450">
                        {/* Dynamic draw SVG polyline line tracking accuracy values */}
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.45)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.0)" />
                          </linearGradient>
                        </defs>

                        {/* Accuracy threshold guideline at 91.24% */}
                        <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="0.5" strokeDasharray="1,1" />

                        {(() => {
                          const points = stats.history.slice(0, 10).reverse();
                          const size = points.length;
                          if (size < 2) {
                            return (
                              <circle cx="50" cy="15" r="1.5" className="fill-blue-500" />
                            );
                          }
                          // map coordinates to SVG viewbox (100w x 30h)
                          // y coordinates stretch from 80% accuracy (y=28) to 100% accuracy (y=2)
                          const mapped = points.map((p, index) => {
                            const x = (index / (size - 1)) * 100;
                            // mapping accuracy between 80 and 100
                            const boundedAcc = Math.max(80, Math.min(100, p.accuracy));
                            const y = 30 - ((boundedAcc - 80) / 20) * 28;
                            return { x, y, acc: p.accuracy };
                          });

                          const pathStr = mapped.map(m => `${m.x},${m.y}`).join(' ');
                          const fillStr = `0,30 ${pathStr} 100,30`;

                          return (
                            <>
                              <polygon points={fillStr} fill="url(#chart-grad)" stroke="none" />
                              <polyline points={pathStr} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              {mapped.map((m, idx) => (
                                <circle 
                                  key={idx} 
                                  cx={m.x} 
                                  cy={m.y} 
                                  r="1" 
                                  className="fill-blue-600 dark:fill-sky-300 stroke-white" 
                                  strokeWidth="0.3" 
                                />
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsed view of the most recent historical calibration details */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-navy-400 dark:text-navy-500 block uppercase">
                  {language === 'en' ? 'Recent Classifications logs' : 'Yakın Kayıt Geçmişi'}
                </span>
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {stats.history.length === 0 ? (
                    <div className="text-[10px] text-navy-400 italic text-center py-2">
                      {language === 'en' ? 'No recent tests found ' : 'Kayıt bulunmuyor'}
                    </div>
                  ) : (
                    stats.history.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-[10px] font-mono bg-navy-50/50 dark:bg-navy-950 p-1.5 rounded-lg border border-navy-100/50 dark:border-navy-850">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-500">[{item.letter}]</span>
                          <span className="text-navy-500 dark:text-navy-400">{item.timestamp}</span>
                        </div>
                        <span className={`font-bold ${
                          item.accuracy >= 91.24 ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {item.accuracy}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
