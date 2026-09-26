import React from 'react';
import { Eraser, Waves } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface DoodleToolbarProps {
  onClear: () => void;
  onTrain: () => void;
  isPrimary: boolean;
}

export const DoodleToolbar: React.FC<DoodleToolbarProps> = ({ 
  onClear, 
  onTrain, 
  isPrimary 
}) => {
  const { t } = useLanguage();
  return (
    <div className="drawing-toolbar">
      <button className="footer-btn secondary" onClick={onClear}>
        <Eraser size={24} />
        <span className={isPrimary ? 'naani-urdu-text' : ''}>{t('doodle.clear')}</span>
      </button>
      <button className="footer-btn primary" onClick={onTrain}>
        <Waves size={24} />
        <span className={isPrimary ? 'naani-urdu-text' : ''}>{t('doodle.train')}</span>
      </button>
    </div>
  );
};
