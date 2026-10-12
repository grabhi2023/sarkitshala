import CategoryLayout from '@/components/blog/CategoryLayout';
import legacy from './legacyLinks';

export default function EspLayout({ children }) {
  return (
    <CategoryLayout category="esp" title="ESP32 Experiments" legacy={legacy}>
      {children}
    </CategoryLayout>
  );
}