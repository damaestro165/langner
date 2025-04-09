import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type IconProps = {
  name: keyof typeof Icons;
  color?: string;
  size?: number;
};

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIconComponent = Icons[name] as LucideIcon | undefined;

  if (!LucideIconComponent) {
    return null;
  }

  return <LucideIconComponent color={color} size={size} />;
};

export default Icon;
