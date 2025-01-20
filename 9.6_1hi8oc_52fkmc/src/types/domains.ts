import { Briefcase, Book, Heart, Home, Users, Coins, Compass, Award } from 'lucide-react';

export interface LifeDomain {
  id: string;
  name: string;
  icon: React.ComponentType;
  color: string;
  keywords: string[];
}

export const LIFE_DOMAINS: LifeDomain[] = [
  {
    id: 'professional',
    name: 'مهني',
    icon: Briefcase,
    color: 'indigo',
    keywords: ['عمل', 'وظيفة', 'مشروع', 'مهنة', 'تدريب']
  },
  {
    id: 'educational',
    name: 'علمي',
    icon: Book,
    color: 'emerald',
    keywords: ['دراسة', 'تعلم', 'قراءة', 'بحث', 'دورة']
  },
  {
    id: 'health',
    name: 'صحي',
    icon: Heart,
    color: 'rose',
    keywords: ['رياضة', 'تغذية', 'طبيب', 'صحة', 'نوم']
  },
  {
    id: 'family',
    name: 'عائلي',
    icon: Home,
    color: 'cyan',
    keywords: ['عائلة', 'أطفال', 'والدين', 'أسرة']
  },
  {
    id: 'social',
    name: 'اجتماعي',
    icon: Users,
    color: 'purple',
    keywords: ['صديق', 'زيارة', 'لقاء', 'تواصل']
  },
  {
    id: 'financial',
    name: 'مالي',
    icon: Coins,
    color: 'amber',
    keywords: ['ميزانية', 'استثمار', 'ادخار', 'مصروف']
  },
  {
    id: 'personal',
    name: 'شخصي',
    icon: Compass,
    color: 'blue',
    keywords: ['تطوير', 'هواية', 'ترفيه', 'راحة']
  },
  {
    id: 'spiritual',
    name: 'روحي',
    icon: Award,
    color: 'teal',
    keywords: ['صلاة', 'تأمل', 'عبادة', 'ذكر']
  }
];
