import CategoryLayout from '@/components/blog/CategoryLayout';
import legacy from './legacyLinks';

export default function RaspberryLayout({ children }) {
  return (
    <CategoryLayout category="raspberry" title="Raspberry Pi Experiments" legacy={legacy}>
      {children}
    </CategoryLayout>
  );
}