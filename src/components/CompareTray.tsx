'use client';
import { X } from 'lucide-react';
import styles from './CompareTray.module.css';

interface CompareTrayProps {
  queue: string[];
  onRemove: (name: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export default function CompareTray({ queue, onRemove, onCompare, onClear }: CompareTrayProps) {
  if (queue.length === 0) return null;

  return (
    <div className={styles.tray}>
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.count}>{queue.length} / 2 Selected</span>
          <div className={styles.names}>
            {queue.map(name => (
              <div key={name} className={styles.chip}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
                <button onClick={() => onRemove(name)} className={styles.removeBtn}><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={onClear} className={styles.clearBtn}>Clear</button>
          <button 
            onClick={onCompare} 
            disabled={queue.length < 2}
            className={`${styles.compareBtn} ${queue.length === 2 ? styles.ready : ''}`}
          >
            Compare Now!
          </button>
        </div>
      </div>
    </div>
  );
}
