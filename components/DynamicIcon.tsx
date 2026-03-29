// Icon.tsx
import * as Icons from 'lucide-react'; // Use namespace import
import { LucideIcon } from 'lucide-react';

type IconProps = {
  name: keyof typeof Icons;
  color?: string;
  size?: number;
  className?: string;
};

const Icon = ({ name, color, size, className }: IconProps) => {
  const LucideIconComponent = Icons[name] as LucideIcon | undefined;

  if (!LucideIconComponent) {
    return null;
  }

  return <LucideIconComponent color={color} size={size} className={className} />;
};

export default Icon;