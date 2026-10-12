import CategoryLayout from '@/components/blog/CategoryLayout';
import legacy from './legacyLinks';

export default function ArduinoLayout({ children }) {
  return (
    <CategoryLayout category="arduino" title="Arduino Experiments" legacy={legacy}>
      {children}
    </CategoryLayout>
  );
}