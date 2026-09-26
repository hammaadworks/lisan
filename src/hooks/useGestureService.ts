import { useEffect, useRef, useState, useCallback } from 'react';
import { GestureModelLoader } from '../recognition/gestures/modelLoader';
import { FaceGestureRecognizer } from '../recognition/gestures/FaceGestureRecognizer';
import { HandGestureRecognizer } from '../recognition/gestures/HandGestureRecognizer';

export type GestureServiceStatus = 'idle' | 'explaining' | 'requesting' | 'active' | 'denied';

/**
 * Deep Gesture Service Hook
 * Owns the full lifecycle: Explaining -> Requesting -> Active | Denied (Recovery)
 */
export const useGestureService = (onAction: (gestureKey: string) => void, forceDisabled: boolean = false) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState<GestureServiceStatus>('idle');
  const [isRecognitionActive, _setIsRecognitionActive] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const effectiveEnabled = isEnabled && !forceDisabled;
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0);
  const isComponentMounted = useRef<boolean>(true);
  
  // Hit Tracking for Stabilization
  const [gestureHits, setGestureHits] = useState<Record<string, number>>({});
  const hitsRef = useRef<Record<string, number>>({});

  const predict = useCallback(async () => {
    if (!videoRef.current || !isRecognitionActive || !isModelLoaded) {
      requestRef.current = requestAnimationFrame(predict);
      return;
    }

    try {
      const { face, hand } = GestureModelLoader.getInstance().getModels();
      if (!face || !hand) {
        requestRef.current = requestAnimationFrame(predict);
        return;
      }

      const timestamp = performance.now();
      const faceResults = face.detectForVideo(videoRef.current, timestamp);
      const handResults = hand.detectForVideo(videoRef.current, timestamp);

      const faceGesture = FaceGestureRecognizer.detectGesture(faceResults);
      const handGesture = HandGestureRecognizer.detectGesture(handResults);

      const activeGesture = faceGesture || handGesture;
      const newHits = { ...hitsRef.current };

      if (activeGesture) {
        newHits[activeGesture] = (newHits[activeGesture] || 0) + 1;
        
        // Trigger action after 5 consecutive hits (Stabilization)
        if (newHits[activeGesture] >= 5) {
          onAction(activeGesture);
          newHits[activeGesture] = -10; // Cooldown
        }
      } else {
        // Decay hits if no gesture detected
        Object.keys(newHits).forEach(k => {
          if (newHits[k] > 0) newHits[k] = Math.max(0, newHits[k] - 1);
          if (newHits[k] < 0) newHits[k] = Math.min(0, newHits[k] + 1);
        });
      }

      hitsRef.current = newHits;
      setGestureHits(newHits);
    } catch (err) {
      console.error('[useGestureService] Prediction failed:', err);
    }

    requestRef.current = requestAnimationFrame(predict);
  }, [isRecognitionActive, isModelLoaded, onAction]);

  // Sync status with initial state
  useEffect(() => {
    if (isEnabled && status === 'idle') {
      setStatus('requesting');
    }
  }, [isEnabled, status]);

  const toggleTracking = useCallback(() => {
    if (!isEnabled) {
      setIsEnabled(true);
      setStatus('explaining');
    } else {
      setIsEnabled(false);
      setStatus('idle');
    }
  }, [isEnabled]);

  const confirmExplainer = useCallback(async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setStatus('active');
      return true;
    } catch (err) {
      console.error('[useGestureService] Permission denied:', err);
      setStatus('denied');
      return false;
    }
  }, []);

  const cancelExplainer = useCallback(() => {
    setIsEnabled(false);
    setStatus('idle');
  }, []);

  // 1. Load Models on Mount
  useEffect(() => {
    isComponentMounted.current = true;
    const load = async () => {
      try {
        await GestureModelLoader.getInstance().loadModels();
        if (isComponentMounted.current) setIsModelLoaded(true);
      } catch (err) {
        console.error('[useGestureService] Model load failed:', err);
      }
    };
    load();
    return () => { isComponentMounted.current = false; };
  }, []);

  // 2. Camera Stream Lifecycle
  useEffect(() => {
    if (!effectiveEnabled || !isModelLoaded || status !== 'active') {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
      }
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        
        if (!isComponentMounted.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.muted = true;
          videoRef.current.onloadedmetadata = async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play();
                requestRef.current = requestAnimationFrame(predict);
              }
            } catch (err) {
              console.error('[useGestureService] Play failed:', err);
            }
          };
        }
      } catch (err) {
        setStatus('denied');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
      }
    };
  }, [effectiveEnabled, isModelLoaded, status]);

  return { 
    isEnabled: effectiveEnabled,
    status,
    confirmExplainer,
    cancelExplainer,
    toggleTracking,
    videoRef, 
    isModelLoaded,
    gestureHits 
  };
};
