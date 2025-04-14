import * as Icons from 'lucide-react'; 

type SidebarLink = {
  label: string;
  route: string;
  icon: keyof typeof Icons; // Ensure icon matches Icons keys
};

export const sidebarLinks: SidebarLink[] = [
  {
    label: 'Home',
    route: '/dashboard',
    icon: 'Home' // Verify exact icon name matches Icons keys
  },
  {
    label: 'Upcoming',
    route: '/upcoming',
    icon: 'Airplay'
  },
  {
    label: 'Previous',
    route: '/previous',
    icon: 'SquareChevronLeft'
  },
  {
    label: 'Recordings',
    route: '/recordings',
    icon: 'FileVideo2'
  },
  {
    label: 'Personal Room',
    route: '/personal-room',
    icon: 'Cctv'
  }
];