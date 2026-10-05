import { Ministry, Leader } from '../types';

export const ministrySeedData: Ministry[] = [
  {
    id: 'sunday-school-children',
    name: 'Children\'s Sunday School & Children\'s Church',
    tagline: 'Exciting Bible stories & verse memorization',
    description: 'At Zion Rd. Independent Baptist Church we love children. We have a Sunday school class for your child and a special children\'s church during adult worship every Sunday morning where children hear exciting Bible stories and memorise God\'s word.',
    meetingTime: 'Sundays at 10:00 AM (Sunday School) & 11:00 AM (Children\'s Church)',
    leader: 'Sunday School Department',
    image: '/sunday-school.jpeg',
    gallery: ['/sunday-school-kids.jpeg'],
    iconName: 'BookOpen',
    color: 'bg-primary',
    textColor: 'text-primary',
    order: 1
  },
  {
    id: 'youth',
    name: 'Youth Ministry & Fellowship',
    tagline: 'Encouraging Bible Study and Christian Fellowship',
    description: 'Youth are the future of the church and nation. Therefore, we have a full youth program that encourages Bible Study and Christian Fellowship through various engaging activities.',
    meetingTime: 'Weekly Youth Activities & Meetings',
    leader: 'Youth Leadership Team',
    image: '/youth.jpeg',
    gallery: ['/youth-1.jpeg', '/youth-activities.jpeg'],
    iconName: 'Shield',
    color: 'bg-accent',
    textColor: 'text-accent',
    order: 2
  },
  {
    id: 'bible-institute',
    name: 'Zion Bible Institute',
    tagline: 'Building lives on the Foundation of God\'s Word',
    description: 'Deep discipleship and theological training to equip believers with answers to life\'s questions through in-depth study of God\'s inspired word.',
    meetingTime: 'Sundays at 5:00 PM',
    leader: 'Pastor Michael Mestler',
    image: '/choir.jpeg',
    gallery: [],
    iconName: 'BookOpen',
    color: 'bg-muted-gold',
    textColor: 'text-muted-gold',
    order: 3
  },
  {
    id: 'zoom-fellowship',
    name: 'ZOOM Bible Fellowship',
    tagline: 'Connecting in God\'s word online',
    description: 'Midweek virtual Bible fellowship bringing church members and families together for prayer, scripture discussion, and encouragement.',
    meetingTime: 'Fridays at 7:30 PM (via ZOOM)',
    leader: 'Church Leadership',
    image: '/men.jpeg',
    gallery: [],
    iconName: 'Users',
    color: 'bg-accent',
    textColor: 'text-accent',
    order: 4
  },
  {
    id: 'adult-bible-study',
    name: 'Adult Bible Study (English & Kiswahili)',
    tagline: 'Worship together as a family',
    description: 'Bilingual adult Bible study in Kiswahili and English designed to help believers grow deeper in understanding and applying God\'s word.',
    meetingTime: 'Sundays at 10:00 AM',
    leader: 'Assistant Pastor Henry Juma Waneloba',
    image: '/women.jpeg',
    gallery: [],
    iconName: 'Heart',
    color: 'bg-primary',
    textColor: 'text-primary',
    order: 5
  }
];

export const leaderSeedData: Leader[] = [
  {
    name: 'Pastor Michael Mestler',
    role: 'Pastor',
    image: '/pastor-michael.jpeg',
    bio: 'Ministering at Zion Road Independent Baptist Church with a commitment to preaching Christ crucified, risen, and coming again, and building lives on the foundation of God\'s Word.',
    responsibilities: ['General Pastoral Oversight', 'Expository Preaching', 'Bible Institute Leadership'],
    order: 1
  },
  {
    name: 'Pastor Henry Juma Waneloba',
    role: 'Assistant Pastor',
    image: '/pastor-henry.jpeg',
    bio: 'Dedicated assistant pastor ministering weekly to the congregation and leading Adult Bible Study in Kiswahili & English.',
    responsibilities: ['Assistant Pastoral Care', 'Adult Bible Study (Kiswahili & English)', 'Community Outreach'],
    order: 2
  }
];
