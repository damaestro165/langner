import * as Icons from 'lucide-react';

const Icon = ({ name, color, size }:{name:string, color?:string, size?:number}) => {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};

export default Icon;
