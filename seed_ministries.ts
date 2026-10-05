import { addMinistry } from './src/services/ministries';

const ministries = [
  {
    name: 'Choir Ministry',
    tagline: 'Lifting voices in praise',
    image: '/choir.jpeg',
    description: 'Our Choir Ministry leads the congregation in spirit-filled worship every Sunday. We believe that praise and worship create an atmosphere for God to move mightily.',
    activities: ['Sunday Service Worship', 'Special Concerts', 'Rehearsals'],
    meetingTime: 'Saturdays, 3:00 PM',
    leader: 'Choir Director',
  },
  {
    name: "Men's Fellowship",
    tagline: 'Iron sharpening iron',
    image: '/men.jpeg',
    description: "The Men's Fellowship is a brotherhood of men committed to growing in faith, family, and purpose.",
    activities: ['Monthly Fellowships', 'Bible Study', 'Community Projects'],
    meetingTime: '1st Saturday, 6:00 AM',
    leader: "Men's Chairman",
  },
  {
    name: "Women's Ministry",
    tagline: 'Empowered women, transformed homes',
    image: '/women.jpeg',
    description: "Our Women's Ministry is a vibrant community of ladies from all walks of life, united in faith and sisterhood.",
    activities: ['Weekly Bible Study', 'Mentorship', 'Outreach'],
    meetingTime: 'Wednesdays, 5:30 PM',
    leader: "Women's Chairlady",
  },
  {
    name: 'Youth Ministry',
    tagline: 'A generation on fire for God',
    image: '/youth.jpeg',
    description: 'Our Youth Ministry is a dynamic and energetic community for young people aged 13–35.',
    activities: ['Sunday Services', 'Camps', 'Sports'],
    meetingTime: 'Sundays, 10:30 AM',
    leader: 'Youth Pastor',
  },
  {
    name: 'Sunday School',
    tagline: 'Raising godly children',
    image: '/sunday-school.jpeg',
    description: 'Sunday School is the foundation we lay for our youngest members (4-12 years).',
    activities: ['Bible Lessons', 'Stories', 'Crafts'],
    meetingTime: 'Sundays, 8:00 AM',
    leader: 'Superintendent',
  },
  {
    name: 'Cadets Ministry',
    tagline: 'Discipline, devotion, and dedication',
    image: '/cadets.jpg',
    description: 'The Cadets Ministry instills discipline, leadership, and a love for God through military-inspired training.',
    activities: ['Drills', 'Parades', 'Community Service'],
    meetingTime: 'Saturdays, 8:00 AM',
    leader: 'Cadet Corps Officer',
  },
  {
    name: 'Children & NextGen',
    tagline: 'Every child precious in His sight',
    image: '/sunday-school-kids.jpeg',
    description: 'NextGen is our comprehensive children\'s ministry (ages 0–12) dedicated to spiritual development.',
    activities: ['Nursery Care', 'Junior Church', 'Kids\' Worship'],
    meetingTime: 'Every Sunday',
    leader: 'Children\'s Director',
  },
];

async function seed() {
  console.log('Starting seed...');
  for (const m of ministries) {
    try {
      await addMinistry(m);
      console.log(`Added: ${m.name}`);
    } catch (e) {
      console.error(`Error adding ${m.name}:`, e);
    }
  }
  console.log('Seed complete!');
}

seed();
