import { useState, useEffect } from 'react'
import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import DriverComparison from './components/DriverComparison';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Add this type for team details
type TeamDetails = {
  [key: string]: {
    drivers: Array<{
      name: string;
      image: string;
    }>;
    country: string;
    tagline: string;
    description: string;
  }
};
const BASE_URL = '/f1-team-ranker'
// Add this constant with team details
const teamDetails: TeamDetails = {
  'Red Bull Racing': {
    drivers: [
      { name: 'Max Verstappen', image: `${BASE_URL}/drivers/verstappen.png` },
      { name: 'Sergio Perez', image: `${BASE_URL}/drivers/perez.png` }
    ],
    country: 'Austria',
    tagline: "The current dominant force in F1",
    description: "Known for their aggressive racing philosophy and aerodynamic excellence, Red Bull Racing has transformed from a rebellious newcomer to F1's benchmark team."
  },
  'Mercedes': {
    drivers: [
      { name: 'Lewis Hamilton', image: `${BASE_URL}/drivers/hamilton.png` },
      { name: 'George Russell', image: `${BASE_URL}/drivers/russell.png` }
    ],
    country: 'Germany',
    tagline: "The silver arrows of modern F1",
    description: "Eight-time consecutive constructors' champions (2014-2021), Mercedes combines German engineering precision with racing excellence."
  },
  'Ferrari': {
    drivers: [
      { name: 'Charles Leclerc', image: `${BASE_URL}/drivers/leclerc.png` },
        { name: 'Carlos Sainz', image: `${BASE_URL}/drivers/sainz.png` }
    ],
    country: 'Italy',
    tagline: "The most iconic team in Formula 1",
    description: "The Scuderia represents passion, heritage, and Italian racing excellence, having competed in every F1 season since 1950."
  },
  'McLaren': {
    drivers: [
      { name: 'Lando Norris', image: `${BASE_URL}/drivers/norris.png` },
      { name: 'Oscar Piastri', image: `${BASE_URL}/drivers/piastri.png` }
    ],
    country: 'United Kingdom',
    tagline: "Racing and innovation pioneers",
    description: "Combining British racing heritage with cutting-edge technology, McLaren continues to push the boundaries of motorsport innovation."
  },
  'Aston Martin': {
    drivers: [
      { name: 'Fernando Alonso', image: `${BASE_URL}/drivers/alonso.png` },
      { name: 'Lance Stroll', image: `${BASE_URL}/drivers/stroll.png` }
    ],
    country: 'United Kingdom',
    tagline: "British racing green meets modern ambition",
    description: "Representing British luxury and engineering prowess, Aston Martin has transformed into a competitive force under Lawrence Stroll's leadership."
  },
  'Alpine': {
    drivers: [
      { name: 'Jack Doohan', image: `${BASE_URL}/drivers/doohan.png` },
      { name: 'Pierre Gasly', image: `${BASE_URL}/drivers/gasly.png` }
    ],
    country: 'France',
    tagline: "French racing excellence reborn",
    description: "Formerly Renault F1, Alpine represents French motorsport heritage with a fresh identity and all-French driver lineup."
  },
  'Williams': {
    drivers: [
      { name: 'Alex Albon', image: `${BASE_URL}/drivers/albon.png` },
      { name: 'Franco Colapinto', image: `${BASE_URL}/drivers/colapinto.png` }
    ],
    country: 'United Kingdom',
    tagline: "Independent racing pioneers",
    description: "One of F1's most successful independent teams, Williams combines a rich heritage with a fighting spirit to return to former glory."
  },
  'RB AlphaTauri': {
    drivers: [
      { name: 'Liam Lawson', image: `${BASE_URL}/drivers/lawson.png` },
      { name: 'Yuki Tsunoda', image: `${BASE_URL}/drivers/tsunoda.png` }
    ],
    country: 'Italy',
    tagline: "Red Bull's talent incubator",
    description: "Formerly Toro Rosso, AlphaTauri serves as Red Bull's junior team while establishing its own competitive identity in F1."
  },
  'Kick Sauber': {
    drivers: [
      { name: 'Valtteri Bottas', image: `${BASE_URL}/drivers/bottas.png` },
      { name: 'Zhou Guanyu', image: `${BASE_URL}/drivers/zhou.png` }
    ],
    country: 'Switzerland',
    tagline: "Racing with Italian heart",
    description: "Operating as Sauber under Alfa Romeo branding, the team combines Swiss precision with Italian racing heritage."
  },
  'Haas F1': {
    drivers: [
      { name: 'Kevin Magnussen', image: `${BASE_URL}/drivers/magnussen.png` },
      { name: 'Nico Hulkenberg', image: `${BASE_URL}/drivers/hulkenberg.png` }
    ],
    country: 'United States',
    tagline: "America's F1 team",
    description: "The newest team on the grid, Haas represents American motorsport in F1 with a unique approach to technical partnerships."
  }
};

// Add URL mappings for drivers and teams
const driverUrls: { [key: string]: string } = {
  'Max Verstappen': 'https://www.formula1.com/en/drivers/max-verstappen.html',
  'Sergio Perez': 'https://www.formula1.com/en/drivers/sergio-perez.html',
  'Lewis Hamilton': 'https://www.formula1.com/en/drivers/lewis-hamilton.html',
  'George Russell': 'https://www.formula1.com/en/drivers/george-russell.html',
  'Charles Leclerc': 'https://www.formula1.com/en/drivers/charles-leclerc.html',
  'Carlos Sainz': 'https://www.formula1.com/en/drivers/carlos-sainz.html',
  'Lando Norris': 'https://www.formula1.com/en/drivers/lando-norris.html',
  'Oscar Piastri': 'https://www.formula1.com/en/drivers/oscar-piastri.html',
  'Fernando Alonso': 'https://www.formula1.com/en/drivers/fernando-alonso.html',
  'Lance Stroll': 'https://www.formula1.com/en/drivers/lance-stroll.html',
  'Pierre Gasly': 'https://www.formula1.com/en/drivers/pierre-gasly.html',
  'Jack Doohan': 'https://www.formula1.com/en/drivers/jack-doohan.html',
  'Alex Albon': 'https://www.formula1.com/en/drivers/alexander-albon.html',
  'Franco Colapinto': 'https://www.formula1.com/en/drivers/franco-colapinto.html',
  'Yuki Tsunoda': 'https://www.formula1.com/en/drivers/yuki-tsunoda.html',
  'Liam Lawson': 'https://www.formula1.com/en/drivers/liam-lawson.html',
  'Valtteri Bottas': 'https://www.formula1.com/en/drivers/valtteri-bottas.html',
  'Zhou Guanyu': 'https://www.formula1.com/en/drivers/zhou-guanyu.html',
  'Kevin Magnussen': 'https://www.formula1.com/en/drivers/kevin-magnussen.html',
  'Nico Hulkenberg': 'https://www.formula1.com/en/drivers/nico-hulkenberg.html'
};

const teamUrls: { [key: string]: string } = {
  'Red Bull Racing': 'https://www.formula1.com/en/teams/Red-Bull-Racing.html',
  'Mercedes': 'https://www.formula1.com/en/teams/Mercedes.html',
  'Ferrari': 'https://www.formula1.com/en/teams/Ferrari.html',
  'McLaren': 'https://www.formula1.com/en/teams/McLaren.html',
  'Aston Martin': 'https://www.formula1.com/en/teams/Aston-Martin.html',
  'Alpine': 'https://www.formula1.com/en/teams/Alpine.html',
  'Williams': 'https://www.formula1.com/en/teams/Williams.html',
  'RB AlphaTauri': 'https://www.formula1.com/en/teams/rb.html',
  'Kick Sauber': 'https://www.formula1.com/en/teams/kick-sauber.html',
  'Haas F1': 'https://www.formula1.com/en/teams/Haas-F1-Team.html'
};

// Add this near other constants at the top
const historicalTeamPoints = {
  'McLaren': 61413.5,
  'Williams': 32398.5,
  'Ferrari': 96699.0,
  'Red Bull Racing': 77850.5,
  'Kick Sauber': 2223.0,
  'Aston Martin': 5830.0,
  'Mercedes': 77810.5,
  'Haas F1': 3463.0,
  'RB AlphaTauri': 2998.0,
  'Alpine': 4746.0
};

// Add this interface with your other interfaces
interface TeamPerformanceData {
  name: string;
  trend: 'Improving' | 'Declining';
  positionTrend: 'Improving' | 'Declining';
  currentPointsPerRace: number;
  currentAvgPosition: number;
  bestPosition: number;
}

// Add this constant with your other constants
const teamPerformanceData: TeamPerformanceData[] = [
  {
    name: "McLaren",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 11.42,
    currentAvgPosition: 5.3,
    bestPosition: 1.0
  },
  {
    name: "Williams",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 0.17,
    currentAvgPosition: 14.9,
    bestPosition: 2.0
  },
  {
    name: "Ferrari",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 11.50,
    currentAvgPosition: 4.5,
    bestPosition: 1.0
  },
  {
    name: "Red Bull Racing",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 14.00,
    currentAvgPosition: 3.8,
    bestPosition: 1.0
  },
  {
    name: "Kick Sauber",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 0.36,
    currentAvgPosition: 13.4,
    bestPosition: 5.0
  },
  {
    name: "Mercedes",
    trend: "Declining",
    positionTrend: "Declining",
    currentPointsPerRace: 8.54,
    currentAvgPosition: 6.1,
    bestPosition: 1.0
  },
  {
    name: "Haas F1",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 1.04,
    currentAvgPosition: 11.6,
    bestPosition: 5.0
  },
  {
    name: "Aston Martin",
    trend: "Improving",
    positionTrend: "Improving",
    currentPointsPerRace: 2.83,
    currentAvgPosition: 10.5,
    bestPosition: 2.0
  },
  {
    name: "RB AlphaTauri",
    trend: "Declining",
    positionTrend: "Declining",
    currentPointsPerRace: 0.50,
    currentAvgPosition: 13.2,
    bestPosition: 1.0
  },
  {
    name: "Alpine",
    trend: "Declining",
    positionTrend: "Declining",
    currentPointsPerRace: 0.38,
    currentAvgPosition: 12.9,
    bestPosition: 1.0
  }
];

type PerformanceData = {
  [key: string]: {
    years: number[];
    points: number[];
  }
};

const PerformancePointsData: PerformanceData = {
  'Mercedes': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [573, 613, 515, 505, 468]
  },
  'Red Bull Racing': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [319, 585, 759, 820, 589]
  },
  'McLaren': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [202, 275, 159, 350, 666]
  },
  'Ferrari': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [131, 323, 554, 504, 652]
  },
  'Alpine': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [181, 155, 173, 120, 65]
  },
  'Aston Martin': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [195, 77, 55, 120, 94]
  },
  'RB AlphaTauri': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [107, 142, 35, 25, 46]
  },
  'Kick Sauber': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [8, 13, 55, 9, 4]
  },
  'Haas F1': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [3, 0, 37, 12, 58]
  },
  'Williams': {
    years: [2020, 2021, 2022, 2023, 2024],
    points: [0, 23, 8, 5, 17]
  }
};

function App() {
  // Update initial weights state to 0
  const [weights, setWeights] = useState({
    performance: 0,
    innovation: 0,
    growthRate: 0,
    heritage: 0,
    hotStreak: 0,
    underdogSpirit: 0,
  })

  // Add state to track if user has interacted with sliders
  const [hasInteracted, setHasInteracted] = useState(false);

  const parameterDescriptions = {
    performance: "Track record of race wins, points, and championship titles in recent seasons.",
    innovation: "Achieving top speeds with cutting-edge designs and fastest lap records.",
    growthRate: "Team's development pace, year-over-year improvements, and future potential",
    heritage: "Established legacy through years of presence in F1.",
    hotStreak: "Recent dominance with consistent points, podiums, or wins over the past year.",
    underdogSpirit: "Inspiring fans by fighting odds and creating excitement as a challenger."
  }

  const parameterDisplayNames = {
    performance: "Performance",
    innovation: "Innovation",
    growthRate: "Growth Rate",
    heritage: "Heritage",
    hotStreak: "Hot Streak",
    underdogSpirit: "Underdog Spirit"
  }

  const teams: Array<{
    id: number;
    name: string;
    logo: string;
    color: string;
    performance: number;
    innovation: number;
    growthRate: number;
    heritage: number;
    hotStreak: number;
    underdogSpirit: number;
    weightedScore?: number;
  }> = [
    {
      id: 1,
      name: 'Red Bull Racing',
      logo: '/logos/redbull.png',
      color: '#0600EF',
      performance: 90,
      innovation: 99,
      growthRate: 67,
      heritage: 26,
      hotStreak: 80,
      underdogSpirit: 25,
    },
    {
      id: 2,
      name: 'Mercedes',
      logo: '/logos/mercedes.png',
      color: '#00D2BE',
      performance: 82,
      innovation: 91,
      growthRate: 12,
      heritage: 19,
      hotStreak: 60,
      underdogSpirit: 20,
    },
    {
      id: 3,
      name: 'Ferrari',
      logo: '/logos/ferrari.png',
      color: '#DC0000',
      performance: 70,
      innovation: 78,
      growthRate: 100,
      heritage: 100,
      hotStreak: 80,
      underdogSpirit: 15,
    },
    {
      id: 4,
      name: 'McLaren',
      logo: '/logos/mclaren.png',
      color: '#FF8700',
      performance: 62,
      innovation: 70,
      growthRate: 72,
      heritage: 78,
      hotStreak: 100,
      underdogSpirit: 30,
    },
    {
      id: 5,
      name: 'Aston Martin',
      logo: '/logos/astonmartin.png',
      color: '#006F62',
      performance: 17,
      innovation: 59,
      growthRate: 52,
      heritage: 5,
      hotStreak: 20,
      underdogSpirit: 80,
    },
    {
      id: 6,
      name: 'Alpine',
      logo: '/logos/alpine.png',
      color: '#0090FF',
      performance: 16,
      innovation: 58,
      growthRate: 10,
      heritage: 64,
      hotStreak: 12,
      underdogSpirit: 90,
    },
    {
      id: 7,
      name: 'Williams',
      logo: '/logos/williams.png',
      color: '#005AFF',
      performance: 3,
      innovation: 50,
      growthRate: 52,
      heritage: 64,
      hotStreak: 2,
      underdogSpirit: 95,
    },
    {
      id: 8,
      name: 'RB AlphaTauri',
      logo: '/logos/alphatauri.png',
      color: '#2B4562',
      performance: 12,
      innovation: 56,
      growthRate: 15,
      heritage: 24,
      hotStreak: 8,
      underdogSpirit: 90,
    },
    {
      id: 9,
      name: 'Kick Sauber',
      logo: '/logos/alfaromeo.png',
      color: '#00e701',
      performance: 7,
      innovation: 50,
      growthRate: 47,
      heritage: 42,
      hotStreak: 1,
      underdogSpirit: 98,
    },
    {
      id: 10,
      name: 'Haas F1',
      logo: '/logos/haas.png',
      color: '#FFFFFF',
      performance: 6,
      innovation: 50,
      growthRate: 88,
      heritage: 10,
      hotStreak: 10,
      underdogSpirit: 100,
    },
  ]


  // Define calculateTeamRankings before using it in useState
  const calculateTeamRankings = () => {
    return teams.map(team => {
      const totalWeights = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
      
      // Normalize the base scores to reduce the gap between teams
      const normalizedScore = (score: number) => {
        return 50 + (score - 50) * 0.8;
      }

      // Calculate raw weighted score with normalized values
      const rawScore = (
        (normalizedScore(team.performance) * weights.performance / 100) +
        (normalizedScore(team.innovation) * weights.innovation / 100) +
        (normalizedScore(team.growthRate) * weights.growthRate / 100) +
        (normalizedScore(team.heritage) * weights.heritage / 100) +
        (normalizedScore(team.hotStreak) * weights.hotStreak / 100) +
        (normalizedScore(team.underdogSpirit) * weights.underdogSpirit / 100)
      )

      // Scale the score to ensure it stays within 0-100 range
      const scaledScore = ((rawScore / totalWeights) * 100).toFixed(2)

      return {
        ...team,
        weightedScore: parseFloat(scaledScore)
      }
    }).sort((a, b) => b.weightedScore! - a.weightedScore!)
  }

  // Now use it in useState
  const [rankedTeams, setRankedTeams] = useState<typeof teams>(() => calculateTeamRankings());

  // Update handleWeightChange to track interaction
  const handleWeightChange = (parameter: string, value: number) => {
    if (!hasInteracted) setHasInteracted(true);
    setWeights(prevWeights => ({
      ...prevWeights,
      [parameter]: value
    }));
  };

  // Update rankings whenever weights change
  useEffect(() => {
    const newRankings = calculateTeamRankings();
    const oldRankings = [...rankedTeams];
    
    // Update rankings
    setRankedTeams(newRankings);

    // Animate changes
    newRankings.forEach((team, newIndex) => {
      const oldIndex = oldRankings.findIndex(t => t.id === team.id);
      if (oldIndex !== newIndex) {
        const element = document.getElementById(`team-${team.id}`);
        if (element) {
          // Remove existing animation classes
          element.classList.remove('ranking-update');
          // Force reflow
          void element.offsetWidth;
          // Add animation classes
          element.classList.add('ranking-update');
          
          // Add extra emphasis for big position changes
          if (Math.abs(oldIndex - newIndex) > 2) {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.backgroundColor = `${team.color}30`;
            setTimeout(() => {
              element.style.backgroundColor = 'transparent';
            }, 800);
          }
        }
      }
    });
  }, [weights]);

  // Add this function to format the data for the radar chart
  const prepareRadarData = (team: typeof teams[0]) => [
    { category: "Performance", value: team.performance },
    { category: "Innovation", value: team.innovation },
    { category: "Growth Rate", value: team.growthRate },
    { category: "Heritage", value: team.heritage },
    { category: "Hot Streak", value: team.hotStreak },
    { category: "Underdog Spirit", value: team.underdogSpirit },
  ];

  const [isDataExplorerVisible, setIsDataExplorerVisible] = useState(false);

  // Add this state near the top of the App function
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0] | null>(null);

  // First, sort the data by points in descending order
  const sortedHistoricalPoints = Object.entries(historicalTeamPoints)
    .sort(([, a], [, b]) => b - a)
    .reduce((obj, [key, value]) => ({
      ...obj,
      [key]: value
    }), {});

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { color: '#fff' }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { 
          color: '#fff',
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          padding: 10
        }
      },
      title: {
        display: true,
        text: 'Team Performance Comparison',
        color: '#fff',
        padding: {
          bottom: 20
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Welcome Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("f1-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70">
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-zinc-800"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl text-center mx-auto px-6 py-20 space-y-8">
          <img 
            src="/f1-logo.png" 
            alt="F1 Logo" 
            className="h-18 w-auto mx-auto mb-20"
          />
          
          <h1 className="text-4xl md:text-4xl font-bold text-center header-gradient-text mb-10 whitespace-nowrap" style={{ fontFamily: 'kelvinized' }}>
            Let's Find You a Team
          </h1>
          
          <p className="text-xl text-gray-100 text-left mb-8 leading-relaxed">
            <strong>What draws you to Formula 1</strong> — speed, precision, or drama <strong>?</strong> Picking your favorite team is about more than just results; it's about connecting with what makes the sport thrilling for you.
          </p>
          <p className="text-lg text-gray-300 text-left mb-15 leading-relaxed">
            So we've created a dashboard to help you discover the best F1 team — for you. Do you care most about race wins and championships? A rich team heritage? Rapid growth and potential? Or maybe you're drawn to the underdog spirit? Use our tool's sliders and filters to weigh the factors that matter most to you, and we'll guide you to the team that fits your F1 fandom.
          </p>

          {/* Scroll Down Button */}
          <button
            onClick={() => {
              const mainContent = document.getElementById('main-content');
              mainContent?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-auto group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {/* Animated background */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity animate-gradient-x"></div>
            
            {/* Button content */}
            <div className="relative flex items-center gap-3">
              <span className="text-white text-md">
                Start Exploring
              </span>
            </div>
          </button>

          {/* Added pulsing down arrow */}
          <div className="mt-8 animate-[pulse_2s_ease-in-out_infinite]">
            <svg 
              className="w-8 h-8 mx-auto text-white/50"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main content wrapper with padding - Add responsive height */}
      <div id="main-content" className={`p-8 md:p-12 pt-16 md:pt-24 transition-all duration-500 ${
        !hasInteracted ? 'min-h-[800px]' : 'min-h-screen'
      }`}>
        <header className="flex flex-col items-center mb-12">
          <img 
            src="/f1-logo-red.png" 
            alt="F1 Logo" 
            className="h-24 w-auto mb-6"
          />
        </header>

        <main className="max-w-6xl mx-auto px-4">
          {/* Parameters and Rankings Container */}
          <div className="flex gap-8 mb-12">
            {/* Parameters Section - Modified width */}
            <div className="flex-3/4 bg-black/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl mb-12 transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-4">What Do You Value in a Team?</h2>
              <p className="text-zinc-400 mb-4 flex items-center gap-2 animate-pulse">
                Drag slider <span className="text-red-500">right</span> to reflect your priorities
                <span className="inline-flex items-center animate-[slideRight_2s_ease-in-out_infinite]">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </span>
              </p>
              <div className="space-y-6">
                {Object.entries(weights).map(([parameter, value]) => (
                  <div key={parameter} className="space-y-3">
                    {/* Parameter Name */}
                    <h3 className="text-lg font-semibold text-red-400">
                      {parameterDisplayNames[parameter as keyof typeof parameterDisplayNames]}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 w-[400px]">
                      {parameterDescriptions[parameter as keyof typeof parameterDescriptions]}
                    </p>
                    
                    {/* Slider Container */}
                    <div className="relative w-[400px]">
                      {/* Slider Track Background */}
                      <div className="absolute h-4 w-full rounded-full bg-gray-700" />
                      
                      {/* Slider Value Indicator */}
                      <div 
                        className="absolute h-4 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-100"
                        style={{ width: `${value}%` }}
                      />
                      
                      {/* Slider Input */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleWeightChange(parameter, parseInt(e.target.value))}
                        className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10"
                        style={{
                          '--thumb-size': '20px',
                          '--thumb-color': '#fff',
                        } as React.CSSProperties}
                      />
                      
                      {/* Custom Thumb */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-100 pointer-events-none"
                        style={{
                          left: `${Math.min(Math.max(value, 3), 100)}%`,
                          transform: 'translate(-65%, -65%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings Section */}
            <div className="flex-1 bg-black/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl mb-12 transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-8">Your Rankings</h2>
              <div 
                className={`space-y-4 relative transition-all duration-500 ${
                  !hasInteracted ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'
                }`}
              >
                {rankedTeams.map((team, index) => (
                  <div 
                    id={`team-${team.id}`}
                    key={team.id} 
                    className="flex items-center gap-3.5 rounded-lg p-3.5 transition-all duration-500 ease-in-out transform"
                    style={{
                      borderLeft: `5px solid ${team.color}`,
                      background: `linear-gradient(90deg, ${team.color}15 0%, rgba(0,0,0,0) 100%)`,
                      position: 'relative',
                      opacity: 0.7,
                      minHeight: '40px',
                    }}
                  >
                    <div 
                      className="w-6 h-6 flex items-center justify-center rounded-full font-bold text-lg transition-colors duration-300"
                      style={{ 
                        backgroundColor: team.color,
                        color: '#000'
                      }}
                    >
                      {index + 1}
                    </div>
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="h-10 w-10 object-contain"
                    />
                    <span className="font-semibold text-lg flex-grow">{team.name}</span>
                    
                    {/* Progress bar background */}
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 ease-in-out"
                      style={{ 
                        width: `${team.weightedScore}%`,
                        background: `linear-gradient(90deg, ${team.color}40 0%, ${team.color} 100%)`
                      }}
                    />
                  </div>
                ))}
              </div>
              {!hasInteracted && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <p className="text-xl">Move the sliders to see your rankings</p>
                </div>
              )}
            </div>
          </div>

          {/* View Results Button */}
          <div className={`flex justify-center transition-all duration-500 ${
            !hasInteracted ? 'mb-8' : 'mb-20'
          }`}>
            <button
              onClick={() => {
                const resultsSection = document.getElementById('results-section');
                resultsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              disabled={!hasInteracted}
              className={`group flex flex-col items-center gap-2 ${
                hasInteracted 
                  ? 'animate-bounce hover:animate-none cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className={`${
                hasInteracted 
                  ? 'text-gray-400 group-hover:text-red-400 transition-colors' 
                  : 'text-gray-600'
              }`}>
                View Your Results
              </span>
              <svg 
                className={`w-6 h-6 ${
                  hasInteracted 
                    ? 'text-gray-400 group-hover:text-red-400 transition-colors' 
                    : 'text-gray-600'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>
          </div>

          {/* Results Section */}
          <div id="results-section" className={`space-y-8 transition-all duration-500 ${
            !hasInteracted ? 'h-0 overflow-hidden' : 'min-h-screen'
          }`}>
            {/* First Box: Team Info + Radar */}
            <div className={`bg-black/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl transition-all duration-500 ${
                !hasInteracted ? 'blur-md opacity-50 h-0 overflow-hidden' : 'blur-0 opacity-100 h-auto'
              }`}
            >
              <h1 className="text-2xl font-semibold mb-6">We Found Your Team!</h1>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold">
                  Your Best F1 Team Match: <span className="text-red-500">{rankedTeams[0]?.name}</span>
                </h3>
              </div>

              {rankedTeams.length > 0 && (
                <div>
                  <div className="grid grid-cols-2 gap-8">
                    {/* Team Info Panel */}
                    <div className="bg-black/30 p-6 rounded-lg"
                      style={{
                        borderLeft: `7px solid ${rankedTeams[0]?.color}`,
                        position: 'relative',
                        opacity: 0.7,
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <a 
                          href={teamUrls[rankedTeams[0].name]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                        >
                          <img 
                            src={rankedTeams[0].logo} 
                            alt={rankedTeams[0].name} 
                            className="h-16 w-auto"
                          />
                          <h3 className="text-2xl font-bold">{rankedTeams[0].name}</h3>
                        </a>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 
                            className="text-lg font-bold mb-4 border-b-2 inline-block"
                            style={{ borderBottomColor: rankedTeams[0]?.color }}
                          >
                            Current Drivers:
                          </h3>
                          <ul className="space-y-3">
                            {teamDetails[rankedTeams[0].name].drivers.map((driver, index) => (
                              <li key={index} className="flex items-center gap-3">
                                <a 
                                  href={driverUrls[driver.name]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                  <img 
                                    src={driver.image} 
                                    alt={driver.name}
                                    className="w-12 h-12 rounded-full object-cover border-2"
                                    style={{ borderColor: rankedTeams[0].color }}
                                  />
                                  <span className="text-lg font-sans tracking-wider uppercase font-semibold">
                                    {driver.name}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center">
                          <p 
                            className="text-lg font-semibold mb-0 mr-2 border-b-2"
                            style={{ borderBottomColor: rankedTeams[0]?.color }}
                          >
                            Based in:
                          </p>
                          <p className="text-lg mb-0">{teamDetails[rankedTeams[0].name].country}</p>
                        </div>
                        
                        <div>
                          <p 
                            className="text-lg font-semibold mb-3 border-b-2 border-red-500 inline-block"
                            style={{ borderBottomColor: rankedTeams[0]?.color }}
                          >
                            Team Identity:
                          </p>
                          <p className="italic">"{teamDetails[rankedTeams[0].name].tagline}"</p>
                        </div>
                        
                        <div>
                          <p className="text-sm mt-4">{teamDetails[rankedTeams[0].name].description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData(rankedTeams[0])}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name={rankedTeams[0].name}
                            dataKey="value"
                            stroke={rankedTeams[0].color}
                            fill={rankedTeams[0].color}
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          {/* Explore Data Button */}
          <div className="flex justify-center my-20">
            <button
              onClick={() => setIsDataExplorerVisible(!isDataExplorerVisible)}
              disabled={!hasInteracted}
              className={`group flex items-center justify-center gap-3 px-6 py-3 rounded-full 
                         transform transition-all duration-300 
                         text-center
                         ${hasInteracted 
                           ? 'bg-black/30 hover:bg-black/50 hover:translate-x-2 animate-[pulse_2s_ease-in-out_infinite] cursor-pointer' 
                           : 'bg-black/10 cursor-not-allowed opacity-50'}`}
            >
              <span className={`transition-colors ${
                hasInteracted ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-500'
              }`}>
                Explore Data on ALL Teams
              </span>
            </button>
          </div>

            {/* Data Explorer Section */}
            <div className={`relative transition-all duration-500 ${
              !hasInteracted ? 'h-0 overflow-hidden opacity-0' : 
              !isDataExplorerVisible ? 'opacity-50 blur-md min-h-[600px]' : 
              'opacity-100 blur-0 min-h-[600px]'
            }`}>
              {/* Title Background */}
              <div className="absolute inset-x-0 top-0 h-16" />
              
              {/* Title */}
              <div className="relative mb-8 text-center">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
                  F1 Data Explorer
                </h2>
                <div className="mt-4 flex justify-center items-center gap-2">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-red-500/50" />
                  <span className="text-gray-400 text-md">Discover team statistics</span>
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-red-500/50" />
                </div>
              </div>

              {/* Main Content */}
              <div className={`bg-zinc-900/80 backdrop-blur-sm rounded-xl p-8 transition-all duration-500 ${
                !hasInteracted ? 'h-0 overflow-hidden' : 'h-auto'
              }`}>
                <p className="text-gray-400 text-center mb-6 flex items-center gap-2 animate-pulse">
                  <span className="text-red-500">Click</span> on a team to explore their detailed statistics and visualizations
                </p>
                
                {/* Team Selection Grid */}
                <div className="grid grid-cols-5 gap-4 mb-3 w-full">
                  {[...rankedTeams]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer 
                        transition-all duration-300 transform ${
                        isDataExplorerVisible ? 'hover:scale-105' : ''
                      } ${
                        selectedTeam?.id === team.id ? 'ring-2 ring-offset-2 scale-105' : ''
                      }`}
                      style={{ 
                        borderColor: team.color,
                        backgroundColor: `${team.color}4D`,
                        outlineColor: team.color,
                        width: '100%',  // Take full width of grid cell
                      }}
                    >
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="h-6 w-6 object-contain flex-shrink-0"  // Added flex-shrink-0
                      />
                      <span className="font-semibold truncate">{team.name}</span>
                    </button>
                  ))}
                </div>

                {/* Team Data Visualization Section */}
                {selectedTeam && (
                  <div className="mt-8 p-6 bg-black/30 rounded-lg">
                    <h3 className="text-xl font-bold mb-4" style={{ color: selectedTeam.color }}>
                      {selectedTeam.name} Statistics
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-black/20 p-4 pb-14 rounded-lg h-[300px]">
                        <div className="relative">
                          <h4 className="text-lg font-semibold mb-4">
                            Historical Points
                            <span className="ml-2 text-gray-500 cursor-help group relative inline-block">ⓘ</span>
                          </h4>
                          {/* Tooltip */}
                          <div className="absolute hidden group-hover:block bg-black/90 text-white px-4 py-2 rounded-md 
                            left-0 top-6 whitespace-nowrap z-10 border border-gray-700">
                            <p className="text-sm">
                              Total Points Since First Race
                            </p>
                          </div>
                        </div>
                        <Bar
                          data={{
                            labels: Object.keys(sortedHistoricalPoints),
                            datasets: [{
                              label: 'All-Time Points',
                              data: Object.values(sortedHistoricalPoints),
                              backgroundColor: Object.keys(sortedHistoricalPoints).map(teamName => 
                                teamName === selectedTeam?.name ? 
                                  `${selectedTeam.color}CC` : 
                                  'rgba(255, 255, 255, 0.1)'
                              ),
                              borderColor: Object.keys(sortedHistoricalPoints).map(teamName => 
                                teamName === selectedTeam?.name ? 
                                  selectedTeam.color : 
                                  'rgba(255, 255, 255, 0.1)'
                              ),
                              borderWidth: 1
                            }]
                          }}
                          options={{
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: { color: '#fff' }
                              },
                              y: {
                                grid: { display: false },
                                ticks: { 
                                  color: (context) => {
                                    const teamName = context.tick.label;
                                    return teamName === selectedTeam?.name ? selectedTeam.color : '#fff';
                                  }
                                }
                              }
                            },
                            plugins: {
                              legend: { display: false }
                            }
                          }}
                        />
                      </div>
                      <div className="bg-black/20 p-4 pb-50 rounded-lg row-span-2 h-[800px]">
                        <div className="h-[400px]">
                          <h4 className="text-lg font-semibold mb-4">Performance Trends</h4>
                          <Line 
                            data={{
                              labels: PerformancePointsData[selectedTeam.name]?.years || [],
                              datasets: [{
                                label: 'Points',
                                data: PerformancePointsData[selectedTeam.name]?.points || [],
                                borderColor: selectedTeam.color,
                                backgroundColor: `${selectedTeam.color}33`,
                                tension: 0.4
                              }]
                            }}
                            options={chartOptions}
                          />
                        </div>
                        
                        <div className="mt-20 space-y-7">
                          {/* Current Season Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                              <h5 className="text-sm font-semibold mb-4">Points per Race</h5>
                              <p className="text-2xl font-bold">{selectedTeam && teamPerformanceData.find(t => t.name === selectedTeam.name)?.currentPointsPerRace.toFixed(2)}</p>
                            </div>
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                              <h5 className="text-sm font-semibold mb-4">Average Position</h5>
                              <p className="text-2xl font-bold">{selectedTeam && teamPerformanceData.find(t => t.name === selectedTeam.name)?.currentAvgPosition.toFixed(1)}</p>
                            </div>
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                              <h5 className="text-sm font-semibold mb-4">Best Position</h5>
                              <p className="text-2xl font-bold">{selectedTeam && teamPerformanceData.find(t => t.name === selectedTeam.name)?.bestPosition}</p>
                            </div>
                          </div>

                          {/* Performance Trend Indicators */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                              <h5 className="text-sm font-semibold mb-4">Performance Trend</h5>
                              <div className="flex items-center space-x-2">
                                <span className={`text-lg font-bold ${
                                  selectedTeam && 
                                  teamPerformanceData.find(t => t.name === selectedTeam.name)?.trend === 'Improving' 
                                    ? 'text-green-400' 
                                    : 'text-red-400'
                                }`}>
                                  {selectedTeam && teamPerformanceData.find(t => t.name === selectedTeam.name)?.trend}
                                </span>
                                <svg 
                                  className={`w-6 h-6 ${
                                    selectedTeam && 
                                    teamPerformanceData.find(t => t.name === selectedTeam.name)?.trend === 'Improving'
                                      ? 'text-green-400 rotate-0'
                                      : 'text-red-400 rotate-180'
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                              <h5 className="text-sm font-semibold mb-4">Position Trend</h5>
                              <div className="flex items-center space-x-2">
                                <span className={`text-lg font-bold ${
                                  selectedTeam && 
                                  teamPerformanceData.find(t => t.name === selectedTeam.name)?.positionTrend === 'Improving'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }`}>
                                  {selectedTeam && teamPerformanceData.find(t => t.name === selectedTeam.name)?.positionTrend}
                                </span>
                                <svg 
                                  className={`w-6 h-6 ${
                                    selectedTeam && 
                                    teamPerformanceData.find(t => t.name === selectedTeam.name)?.positionTrend === 'Improving'
                                      ? 'text-green-400 rotate-0'
                                      : 'text-red-400 rotate-180'
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-4">Driver Comparison</h4>
                        {selectedTeam && (
                          <DriverComparison selectedTeam={selectedTeam.name} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer - Add conditional margin */}
      <footer className={`bg-zinc-900/80 backdrop-blur-sm py-8 transition-all duration-500 ${
        !hasInteracted ? 'mt-8' : 'mt-20'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">F1 Team Picker</h4>
              <p className="text-zinc-400 text-sm">
                A fan-made tool to help you discover which Formula 1 team you would most likely root for.
                Only teams active in recent seasons are included.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Disclaimer</h4>
              <p className="text-zinc-400 text-sm">
                This is an unofficial Formula 1 website. F1, FORMULA ONE, and related marks are trademarks of Formula One Licensing B.V. It is not affiliated with, endorsed by, or generates revenue from Formula 1 or any F1 teams.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li>
                  <a 
                    href="https://www.formula1.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors"
                  >
                    Official F1 Website
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/joliekim/f1-team-ranker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a 
                    href="https://ergast.com/mrd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors"
                  >
                    Ergast Motor Racing Data (Source Data)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            <p>© {new Date().getFullYear()} Jolie Kim. All rights reserved.</p>
            <p className="mt-2">
              Created by{' '}
              <a 
                href="https://www.linkedin.com/in/jolieheejikim/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300"
              >
                Jolie
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App