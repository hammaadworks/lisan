import React from 'react';
import { useGestureService } from '../hooks/useGestureService';
import { CameraPreview } from './CameraPreview';
import { Camera, ShieldAlert, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { GestureLegend } from './GestureLegend';
import { useAppConfig } from '../hooks/useAppConfig';

interface GestureServiceProps {
  onAction: (gestureKey: string) => void;
  forceDisabled?: boolean;
  onDragChange?: (isDragging: boolean) => void;
  onDrop?: (rect: DOMRect) => void;
  cameraButtonRef: React.RefObject<HTMLButtonElement | null>;
  onLongPressGesture?: (gesture: any) => void;
  lastGesture?: string;
}

/**
 * Deep Module: Gesture Service
 * Encapsulates the entire camera lifecycle, permission UI, and MediaPipe preview.
 * Exposes a clean seam for the App orchestrator.
 */
export const GestureService: React.FC<GestureServiceProps> = ({
  onAction,
  forceDisabled = false,
  onDragChange,
  onDrop,
  cameraButtonRef: _cameraButtonRef,
  onLongPressGesture,
  lastGesture = ''
}) => {
  const { t } = useLanguage();
  const { config } = useAppConfig();
  const { 
    isEnabled, 
    status, 
    confirmExplainer, 
    cancelExplainer, 
    toggleTracking, 
    videoRef,
    gestureHits
  } = useGestureService(onAction, forceDisabled);

  // Expose toggle globally for the Header button to use
  React.useEffect(() => {
    (window as any)._toggleGestureService = toggleTracking;
    return () => {
      delete (window as any)._toggleGestureService;
    };
  }, [toggleTracking]);

  // Determine what UI surface to render based on internal status
  if (!isEnabled) return null;

  if (status === 'explaining' || status === 'requesting') {
    return (
      <div className="shukr-dialog-overlay" style={{ zIndex: 9999 }}>
        <div className="shukr-dialog naani-friendly">
          <div className="shukr-dialog-icon-header">
             <Camera size={48} color="var(--color-primary)" />
          </div>
          <h2 className="shukr-dialog-title">{t('dialogs.enableCamera')}</h2>
          <div className="shukr-dialog-desc">
            <p>{t('dialogs.enableCameraDesc')}</p>
          </div>
          <div className="shukr-dialog-actions">
            <button className="shukr-dialog-btn btn-cancel" onClick={cancelExplainer}>
              {t('dialogs.close')}
            </button>
            <button className="shukr-dialog-btn btn-confirm" onClick={confirmExplainer} disabled={status === 'requesting'}>
              <Check size={20} />
              {status === 'requesting' ? '...' : t('dialogs.allow')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="shukr-dialog-overlay" style={{ zIndex: 9999 }}>
        <div className="shukr-dialog naani-friendly">
          <div className="shukr-dialog-icon-header">
             <ShieldAlert size={48} color="var(--color-danger)" />
          </div>
          <h2 className="shukr-dialog-title">{t('dialogs.cameraDenied')}</h2>
          <div className="shukr-dialog-desc">
            <p>Camera access is blocked by your browser. To use hands-free gestures, please click the lock icon 🔒 in your address bar and allow camera access.</p>
          </div>
          <div className="shukr-dialog-actions">
            <button className="shukr-dialog-btn btn-confirm" onClick={cancelExplainer} style={{ width: '100%' }}>
              I understand
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active status renders the draggable preview and the legend
  return (
    <>
      <CameraPreview 
        isEnabled={status === 'active'}
        videoRef={videoRef as any}
        onDragChange={onDragChange}
        onDrop={onDrop}
      />
      {status === 'active' && (
        <GestureLegend 
          lastGesture={lastGesture}
          mappings={config?.gesture_mappings || {}} 
          onLongPress={onLongPressGesture || (() => {})}
          onTrigger={onAction}
          gestureHits={gestureHits}
        />
      )}
    </>
  );
};
