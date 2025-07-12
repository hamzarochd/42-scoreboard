import { Student, Pooler, User } from '@/types';
import { CAMPUSES, generateAvatarUrl, getProfileUrl } from '@/utils';

// Demo user for authentication
export const demoUser: User = {
  id: '1',
  login: 'hmrochd',
  email: 'hmrochd@student.42.fr',
  firstName: 'Hamza',
  lastName: 'Rochd',
  displayName: 'Hamza Rochd',
  avatar: generateAvatarUrl('hmrochd'),
};

// Generate mock students data
export const mockStudents: Student[] = [
  {
    id: '1',
    login: 'hmrochd',
    firstName: 'Hamza',
    lastName: 'Rochd',
    displayName: 'Hamza Rochd',
    email: 'hmrochd@student.42.fr',
    avatar: generateAvatarUrl('hmrochd'),
    level: 21.42,
    promoYear: 2022,
    wallet: 750,
    evaluationPoints: 12,
    status: { isOnline: true, location: 'c3r8p1' },
    profileUrl: getProfileUrl('hmrochd'),
    campus: 'Paris',
    cursusUsers: [{ cursusId: 21, level: 21.42 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 125, status: 'finished' },
      { id: '2', name: 'ft_printf', finalMark: 100, status: 'finished' },
      { id: '3', name: 'webserv', status: 'in_progress' },
    ],
  },
  {
    id: '2',
    login: 'asmith',
    firstName: 'Alice',
    lastName: 'Smith',
    displayName: 'Alice Smith',
    email: 'asmith@student.42.fr',
    avatar: generateAvatarUrl('asmith'),
    level: 18.76,
    promoYear: 2021,
    wallet: 1200,
    evaluationPoints: 8,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
    profileUrl: getProfileUrl('asmith'),
    campus: 'Paris',
    cursusUsers: [{ cursusId: 21, level: 18.76 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 115, status: 'finished' },
      { id: '2', name: 'ft_printf', finalMark: 84, status: 'finished' },
    ],
  },
  {
    id: '3',
    login: 'bjohnson',
    firstName: 'Bob',
    lastName: 'Johnson',
    displayName: 'Bob Johnson',
    email: 'bjohnson@student.42.fr',
    avatar: generateAvatarUrl('bjohnson'),
    level: 15.23,
    promoYear: 2023,
    wallet: 450,
    evaluationPoints: 15,
    status: { isOnline: true, location: 'c1r2p3' },
    profileUrl: getProfileUrl('bjohnson'),
    campus: 'Madrid',
    cursusUsers: [{ cursusId: 21, level: 15.23 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 98, status: 'finished' },
      { id: '2', name: 'born2beroot', status: 'in_progress' },
    ],
  },
  {
    id: '4',
    login: 'cgarcia',
    firstName: 'Carlos',
    lastName: 'Garcia',
    displayName: 'Carlos Garcia',
    email: 'cgarcia@student.42.fr',
    avatar: generateAvatarUrl('cgarcia'),
    level: 12.89,
    promoYear: 2023,
    wallet: 320,
    evaluationPoints: 9,
    status: { isOnline: true, location: 'c2r4p5' },
    profileUrl: getProfileUrl('cgarcia'),
    campus: 'Barcelona',
    cursusUsers: [{ cursusId: 21, level: 12.89 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 110, status: 'finished' },
      { id: '2', name: 'get_next_line', finalMark: 92, status: 'finished' },
    ],
  },
  {
    id: '5',
    login: 'dmiller',
    firstName: 'Diana',
    lastName: 'Miller',
    displayName: 'Diana Miller',
    email: 'dmiller@student.42.fr',
    avatar: generateAvatarUrl('dmiller'),
    level: 22.15,
    promoYear: 2020,
    wallet: 980,
    evaluationPoints: 6,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 7200000) },
    profileUrl: getProfileUrl('dmiller'),
    campus: 'Fremont',
    cursusUsers: [{ cursusId: 21, level: 22.15 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 125, status: 'finished' },
      { id: '2', name: 'ft_printf', finalMark: 100, status: 'finished' },
      { id: '3', name: 'inception', finalMark: 100, status: 'finished' },
    ],
  },
  {
    id: '6',
    login: 'ewilson',
    firstName: 'Emma',
    lastName: 'Wilson',
    displayName: 'Emma Wilson',
    email: 'ewilson@student.42.fr',
    avatar: generateAvatarUrl('ewilson'),
    level: 9.67,
    promoYear: 2024,
    wallet: 180,
    evaluationPoints: 18,
    status: { isOnline: true, location: 'c4r1p2' },
    profileUrl: getProfileUrl('ewilson'),
    campus: 'Berlin',
    cursusUsers: [{ cursusId: 21, level: 9.67 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 88, status: 'finished' },
      { id: '2', name: 'ft_printf', status: 'in_progress' },
    ],
  },
  {
    id: '7',
    login: 'ftaylor',
    firstName: 'Frank',
    lastName: 'Taylor',
    displayName: 'Frank Taylor',
    email: 'ftaylor@student.42.fr',
    avatar: generateAvatarUrl('ftaylor'),
    level: 16.44,
    promoYear: 2022,
    wallet: 610,
    evaluationPoints: 11,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 1800000) },
    profileUrl: getProfileUrl('ftaylor'),
    campus: 'Brussels',
    cursusUsers: [{ cursusId: 21, level: 16.44 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 105, status: 'finished' },
      { id: '2', name: 'push_swap', finalMark: 84, status: 'finished' },
    ],
  },
  {
    id: '8',
    login: 'glee',
    firstName: 'Grace',
    lastName: 'Lee',
    displayName: 'Grace Lee',
    email: 'glee@student.42.fr',
    avatar: generateAvatarUrl('glee'),
    level: 19.88,
    promoYear: 2021,
    wallet: 840,
    evaluationPoints: 7,
    status: { isOnline: true, location: 'c1r5p4' },
    profileUrl: getProfileUrl('glee'),
    campus: 'Seoul',
    cursusUsers: [{ cursusId: 21, level: 19.88 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 118, status: 'finished' },
      { id: '2', name: 'minishell', finalMark: 98, status: 'finished' },
    ],
  },
  // 2025 Students
  {
    id: '9',
    login: 'ngarcia',
    firstName: 'Nicolas',
    lastName: 'Garcia',
    displayName: 'Nicolas Garcia',
    email: 'ngarcia@student.42.fr',
    avatar: generateAvatarUrl('ngarcia'),
    level: 5.34,
    promoYear: 2025,
    wallet: 120,
    evaluationPoints: 22,
    status: { isOnline: true, location: 'c2r3p5' },
    profileUrl: getProfileUrl('ngarcia'),
    campus: 'Madrid',
    cursusUsers: [{ cursusId: 21, level: 5.34 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 98, status: 'finished' },
      { id: '2', name: 'born2beroot', status: 'in_progress' },
    ],
  },
  {
    id: '10',
    login: 'lbrown',
    firstName: 'Luna',
    lastName: 'Brown',
    displayName: 'Luna Brown',
    email: 'lbrown@student.42.fr',
    avatar: generateAvatarUrl('lbrown'),
    level: 7.89,
    promoYear: 2025,
    wallet: 280,
    evaluationPoints: 15,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
    profileUrl: getProfileUrl('lbrown'),
    campus: 'Paris',
    cursusUsers: [{ cursusId: 21, level: 7.89 }],
    projects: [
      { id: '1', name: 'libft', finalMark: 115, status: 'finished' },
      { id: '2', name: 'ft_printf', finalMark: 89, status: 'finished' },
      { id: '3', name: 'get_next_line', status: 'in_progress' },
    ],
  },
  {
    id: '11',
    login: 'awhite',
    firstName: 'Alex',
    lastName: 'White',
    displayName: 'Alex White',
    email: 'awhite@student.42.fr',
    avatar: generateAvatarUrl('awhite'),
    level: 3.21,
    promoYear: 2025,
    wallet: 85,
    evaluationPoints: 25,
    status: { isOnline: true, location: 'c1r1p1' },
    profileUrl: getProfileUrl('awhite'),
    campus: 'Berlin',
    cursusUsers: [{ cursusId: 21, level: 3.21 }],
    projects: [
      { id: '1', name: 'libft', status: 'in_progress' },
    ],
  },
];

// Generate mock poolers data
export const mockPoolers: Pooler[] = [
  {
    id: '101',
    login: 'pisciner1',
    firstName: 'Alex',
    lastName: 'Johnson',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@student.42.fr',
    avatar: generateAvatarUrl('pisciner1'),
    level: 4.23,
    poolMonth: 'September 2024',
    poolYear: 2024,
    status: { isOnline: true, location: 'c5r2p1' },
    profileUrl: getProfileUrl('pisciner1'),
    campus: 'Paris',
    poolStartDate: '2024-09-01',
    poolEndDate: '2024-09-28',
    projects: [
      { id: '1', name: 'Shell00', finalMark: 85, status: 'finished' },
      { id: '2', name: 'Shell01', finalMark: 90, status: 'finished' },
      { id: '3', name: 'C00', status: 'in_progress' },
    ],
  },
  {
    id: '102',
    login: 'pisciner2',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    displayName: 'Maria Rodriguez',
    email: 'maria.rodriguez@student.42.fr',
    avatar: generateAvatarUrl('pisciner2'),
    level: 3.76,
    poolMonth: 'September 2024',
    poolYear: 2024,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 1200000) },
    profileUrl: getProfileUrl('pisciner2'),
    campus: 'Madrid',
    poolStartDate: '2024-09-01',
    poolEndDate: '2024-09-28',
    projects: [
      { id: '1', name: 'Shell00', finalMark: 75, status: 'finished' },
      { id: '2', name: 'Shell01', status: 'in_progress' },
    ],
  },
  {
    id: '103',
    login: 'pisciner3',
    firstName: 'David',
    lastName: 'Chen',
    displayName: 'David Chen',
    email: 'david.chen@student.42.fr',
    avatar: generateAvatarUrl('pisciner3'),
    level: 2.89,
    poolMonth: 'August 2024',
    poolYear: 2024,
    status: { isOnline: true, location: 'c2r5p12' },
    profileUrl: getProfileUrl('pisciner3'),
    campus: 'Singapore',
    poolStartDate: '2024-08-01',
    poolEndDate: '2024-08-30',
    projects: [
      { id: '1', name: 'Shell00', finalMark: 80, status: 'finished' },
      { id: '2', name: 'Shell01', status: 'searching_a_group' },
    ],
  },
  {
    id: '104',
    login: 'pisciner4',
    firstName: 'Sophie',
    lastName: 'Martin',
    displayName: 'Sophie Martin',
    email: 'sophie.martin@student.42.fr',
    avatar: generateAvatarUrl('pisciner4'),
    level: 5.12,
    poolMonth: 'July 2024',
    poolYear: 2024,
    status: { isOnline: true, location: 'c4r1p7' },
    profileUrl: getProfileUrl('pisciner4'),
    campus: 'Lyon',
    poolStartDate: '2024-07-01',
    poolEndDate: '2024-07-26',
    projects: [
      { id: '1', name: 'Shell00', finalMark: 65, status: 'finished' },
      { id: '2', name: 'Shell01', finalMark: 40, status: 'finished' },
    ],
  },
  {
    id: '105',
    login: 'pisciner5',
    firstName: 'Lucas',
    lastName: 'Silva',
    displayName: 'Lucas Silva',
    email: 'lucas.silva@student.42.fr',
    avatar: generateAvatarUrl('pisciner5'),
    level: 1.45,
    poolMonth: 'October 2024',
    poolYear: 2024,
    status: { isOnline: false, lastSeen: new Date(Date.now() - 3600000) },
    profileUrl: getProfileUrl('pisciner5'),
    campus: 'São Paulo',
    poolStartDate: '2024-10-01',
    poolEndDate: '2024-10-25',
    projects: [
      { id: '1', name: 'Shell00', status: 'in_progress' },
    ],
  },
  {
    id: '106',
    login: 'pisciner6',
    firstName: 'Anna',
    lastName: 'Mueller',
    displayName: 'Anna Mueller',
    email: 'anna.mueller@student.42.fr',
    avatar: generateAvatarUrl('pisciner6'),
    level: 6.78,
    poolMonth: 'June 2024',
    poolYear: 2024,
    status: { isOnline: true, location: 'c1r2p3' },
    profileUrl: getProfileUrl('pisciner6'),
    campus: 'Berlin',
    poolStartDate: '2024-06-01',
    poolEndDate: '2024-06-28',
    projects: [
      { id: '1', name: 'Shell00', finalMark: 100, status: 'finished' },
      { id: '2', name: 'Shell01', finalMark: 95, status: 'finished' },
      { id: '3', name: 'C00', finalMark: 88, status: 'finished' },
    ],
  },
];

// Generate additional mock data to simulate a larger dataset
const generateMoreStudents = (count: number): Student[] => {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Tom', 'Lisa', 'Chris', 'Anna', 'David', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const login = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    const year = years[i % years.length];
    
    return {
      id: `student_${i + 100}`,
      login,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email: `${login}@student.42.fr`,
      avatar: generateAvatarUrl(login),
      level: Math.random() * 25,
      promoYear: year,
      wallet: Math.floor(Math.random() * 1000),
      evaluationPoints: Math.floor(Math.random() * 20),
      status: {
        isOnline: Math.random() > 0.6,
        ...(Math.random() > 0.6 ? {} : { lastSeen: new Date(Date.now() - Math.random() * 86400000) }),
      },
      profileUrl: getProfileUrl(login),
      campus: CAMPUSES[i % CAMPUSES.length],
      cursusUsers: [{ cursusId: 21, level: Math.random() * 25 }],
      projects: [],
    };
  });
};

const generateMorePoolers = (count: number): Pooler[] => {
  const firstNames = ['Oliver', 'Emma', 'Liam', 'Sophia', 'Noah', 'Isabella', 'Ethan', 'Mia', 'Lucas', 'Charlotte'];
  const lastNames = ['Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Hernandez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];
  const months = [
    'July 2019', 'August 2019', 'September 2019',
    'January 2020', 'February 2020', 'March 2020', 'July 2020', 'August 2020', 'September 2020',
    'January 2021', 'February 2021', 'March 2021', 'July 2021', 'August 2021', 'September 2021',
    'January 2022', 'February 2022', 'March 2022', 'July 2022', 'August 2022', 'September 2022',
    'January 2023', 'February 2023', 'March 2023', 'July 2023', 'August 2023', 'September 2023',
    'July 2024', 'August 2024', 'September 2024', 'January 2025', 'February 2025', 'March 2025'
  ];

  const getMonthNumber = (monthName: string): string => {
    const monthMap: { [key: string]: string } = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return monthMap[monthName] || '01';
  };
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const login = `pooler${firstName.toLowerCase()}${i}`;
    const poolMonth = months[i % months.length];
    const poolYear = parseInt(poolMonth.split(' ')[1]);
    const monthName = poolMonth.split(' ')[0];
    const poolStartDate = `${poolYear}-${getMonthNumber(monthName)}-01`;
    const poolEndDate = `${poolYear}-${getMonthNumber(monthName)}-28`;
    
    return {
      id: `pooler_${i + 200}`,
      login,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email: `${login}@student.42.fr`,
      avatar: generateAvatarUrl(login),
      level: Math.random() * 8,
      poolMonth,
      poolYear,
      status: {
        isOnline: Math.random() > 0.5,
        ...(Math.random() > 0.5 ? {} : { lastSeen: new Date(Date.now() - Math.random() * 86400000) }),
      },
      profileUrl: getProfileUrl(login),
      campus: CAMPUSES[i % CAMPUSES.length],
      poolStartDate,
      poolEndDate,
      projects: [],
    };
  });
};

// Export complete datasets
export const allMockStudents = [...mockStudents, ...generateMoreStudents(30)];
export const allMockPoolers = [...mockPoolers, ...generateMorePoolers(20)];
