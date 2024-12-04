import { useState, useEffect } from 'react'
import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Add this type for team details
type TeamDetails = {
  [key: string]: {
    drivers: string[];
    country: string;
    tagline: string;
    description: string;
  }
};

// Add this constant with team details
const teamDetails: TeamDetails = {
  'Red Bull Racing': {
    drivers: ['Max Verstappen', 'Sergio Perez'],
    country: 'Austria',
    tagline: "The current dominant force in F1",
    description: "Known for their aggressive racing philosophy and aerodynamic excellence, Red Bull Racing has transformed from a rebellious newcomer to F1's benchmark team."
  },
  'Mercedes': {
    drivers: ['Lewis Hamilton', 'George Russell'],
    country: 'Germany',
    tagline: "The silver arrows of modern F1",
    description: "Eight-time consecutive constructors' champions (2014-2021), Mercedes combines German engineering precision with racing excellence."
  },
  'Ferrari': {
    drivers: ['Charles Leclerc', 'Carlos Sainz'],
    country: 'Italy',
    tagline: "The most iconic team in Formula 1",
    description: "The Scuderia represents passion, heritage, and Italian racing excellence, having competed in every F1 season since 1950."
  },
  'McLaren': {
    drivers: ['Lando Norris', 'Oscar Piastri'],
    country: 'United Kingdom',
    tagline: "Racing and innovation pioneers",
    description: "Combining British racing heritage with cutting-edge technology, McLaren continues to push the boundaries of motorsport innovation."
  },
  'Aston Martin': {
    drivers: ['Fernando Alonso', 'Lance Stroll'],
    country: 'United Kingdom',
    tagline: "British racing green meets modern ambition",
    description: "Representing British luxury and engineering prowess, Aston Martin has transformed into a competitive force under Lawrence Stroll's leadership."
  },
  'Alpine': {
    drivers: ['Esteban Ocon', 'Pierre Gasly'],
    country: 'France',
    tagline: "French racing excellence reborn",
    description: "Formerly Renault F1, Alpine represents French motorsport heritage with a fresh identity and all-French driver lineup."
  },
  'Williams': {
    drivers: ['Alex Albon', 'Franco Colapinto'],
    country: 'United Kingdom',
    tagline: "Independent racing pioneers",
    description: "One of F1's most successful independent teams, Williams combines a rich heritage with a fighting spirit to return to former glory."
  },
  'AlphaTauri': {
    drivers: ['Liam Lawson', 'Yuki Tsunoda'],
    country: 'Italy',
    tagline: "Red Bull's talent incubator",
    description: "Formerly Toro Rosso, AlphaTauri serves as Red Bull's junior team while establishing its own competitive identity in F1."
  },
  'Alfa Romeo': {
    drivers: ['Valtteri Bottas', 'Zhou Guanyu'],
    country: 'Switzerland',
    tagline: "Racing with Italian heart",
    description: "Operating as Sauber under Alfa Romeo branding, the team combines Swiss precision with Italian racing heritage."
  },
  'Haas F1': {
    drivers: ['Kevin Magnussen', 'Nico Hulkenberg'],
    country: 'United States',
    tagline: "America's F1 team",
    description: "The newest team on the grid, Haas represents American motorsport in F1 with a unique approach to technical partnerships."
  }
};

function App() {
  // Define initial weights for different parameters (total should be 100%)
  const [weights, setWeights] = useState({
    performance: 25,
    innovation: 20,
    growthRate: 20,
    heritage: 15,
    resilience: 10,
    underdogSpirit: 10,
  })

  const parameterDescriptions = {
    performance: "Track record of race wins, podiums, and championship titles in recent seasons",
    innovation: "Technical developments, car design excellence, and adaptation to regulation changes",
    growthRate: "Team's development pace, year-over-year improvements, and future potential",
    heritage: "Historical significance, years in F1, and past achievements",
    resilience: "Adaptability to setbacks, resourcefulness, and maintaining competitiveness.",
    underdogSpirit: "Inspiring fans by fighting odds and creating excitement as a challenger."
  }

  const parameterDisplayNames = {
    performance: "Performance",
    innovation: "Innovation",
    growthRate: "Growth Rate",
    heritage: "Heritage",
    resilience: "Resilience",
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
    resilience: number;
    underdogSpirit: number;
    weightedScore?: number;
  }> = [
    {
      id: 1,
      name: 'Red Bull Racing',
      logo: '/logos/redbull.png',
      color: '#0600EF',
      performance: 85,
      innovation: 85,
      growthRate: 85,
      heritage: 60,
      resilience: 65,
      underdogSpirit: 50,
    },
    {
      id: 2,
      name: 'Mercedes',
      logo: '/logos/mercedes.png',
      color: '#00D2BE',
      performance: 60,
      innovation: 70,
      growthRate: 50,
      heritage: 80,
      resilience: 70,
      underdogSpirit: 40,
    },
    {
      id: 3,
      name: 'Ferrari',
      logo: '/logos/ferrari.png',
      color: '#DC0000',
      performance: 88,
      innovation: 80,
      growthRate: 85,
      heritage: 100,
      resilience: 70,
      underdogSpirit: 40,
    },
    {
      id: 4,
      name: 'McLaren',
      logo: '/logos/mclaren.png',
      color: '#FF8700',
      performance: 90,
      innovation: 90,
      growthRate: 95,
      heritage: 85,
      resilience: 70,
      underdogSpirit: 55,
    },
    {
      id: 5,
      name: 'Aston Martin',
      logo: '/logos/astonmartin.png',
      color: '#006F62',
      performance: 50,
      innovation: 70,
      growthRate: 65,
      heritage: 70,
      resilience: 80,
      underdogSpirit: 90,
    },
    {
      id: 6,
      name: 'Alpine',
      logo: '/logos/alpine.png',
      color: '#0090FF',
      performance: 45,
      innovation: 50,
      growthRate: 50,
      heritage: 65,
      resilience: 80,
      underdogSpirit: 90,
    },
    {
      id: 7,
      name: 'Williams',
      logo: '/logos/williams.png',
      color: '#005AFF',
      performance: 45,
      innovation: 55,
      growthRate: 60,
      heritage: 85,
      resilience: 98,
      underdogSpirit: 95,
    },
    {
      id: 8,
      name: 'RB AlphaTauri',
      logo: '/logos/alphatauri.png',
      color: '#2B4562',
      performance: 50,
      innovation: 55,
      growthRate: 45,
      heritage: 45,
      resilience: 90,
      underdogSpirit: 90,
    },
    {
      id: 9,
      name: 'Kick Sauber',
      logo: '/logos/alfaromeo.png',
      color: '#00e701',
      performance: 45,
      innovation: 50,
      growthRate: 50,
      heritage: 75,
      resilience: 90,
      underdogSpirit: 98,
    },
    {
      id: 10,
      name: 'Haas F1',
      logo: '/logos/haas.png',
      color: '#FFFFFF',
      performance: 40,
      innovation: 45,
      growthRate: 45,
      heritage: 35,
      resilience: 95,
      underdogSpirit: 100,
    },
  ]

  const [rankedTeams, setRankedTeams] = useState<typeof teams>([]);
  const [showResults, setShowResults] = useState(false);

  // Calculate weighted scores for each team
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
        (normalizedScore(team.resilience) * weights.resilience / 100) +
        (normalizedScore(team.underdogSpirit) * weights.underdogSpirit / 100)
      )

      // Scale the score to ensure it stays within 0-100 range
      const scaledScore = ((rawScore / totalWeights) * 100).toFixed(2)

      return {
        ...team,
        weightedScore: parseFloat(scaledScore)
      }
    }).sort((a, b) => b.weightedScore - a.weightedScore)
  }

  // Handle weight changes
  const handleWeightChange = (parameter: string, value: number) => {
    setWeights(prevWeights => ({
      ...prevWeights,
      [parameter]: value
    }));
  };

  // Initial calculation
  const calculateRankings = () => {
    setRankedTeams(calculateTeamRankings());
    setShowResults(true);
  };

  // Update rankings whenever weights change
  useEffect(() => {
    if (showResults) {
      setRankedTeams(calculateTeamRankings());
    }
  }, [weights, showResults]); // Added dependencies

  // Add this function to format the data for the radar chart
  const prepareRadarData = (team: typeof teams[0]) => [
    { category: "Performance", value: team.performance },
    { category: "Innovation", value: team.innovation },
    { category: "Growth Rate", value: team.growthRate },
    { category: "Heritage", value: team.heritage },
    { category: "Resilience", value: team.resilience },
    { category: "Underdog Spirit", value: team.underdogSpirit },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content wrapper with padding */}
      <div className="p-8 md:p-12 pt-16 md:pt-24 flex-grow">
        <header className="flex flex-col items-center mb-12">
          <img 
            src="/f1-logo.png" 
            alt="F1 Logo" 
            className="h-16 w-auto mb-10"
          />
          <h1 className="text-4xl font-bold header-gradient-text text-center">
            Find Out Your F1 Team Bias
          </h1>
        </header>

        <main className="max-w-6xl mx-auto px-4">
          {/* Parameters Section - Darker background when results are shown */}
          <div className={`${
            showResults ? 'bg-black/80' : 'bg-black/50'
          } backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl mb-12 transition-colors duration-300`}>
            <h2 className="text-2xl font-semibold mb-6">What Do You Value in a Team?</h2>
            <div className="space-y-6">
              {Object.entries(weights).map(([parameter, value]) => (
                <div key={parameter} className="flex items-center gap-6">
                  <div className="relative inline-block group">
                    <span className="text-lg hover:underline">
                      {parameterDisplayNames[parameter as keyof typeof parameterDisplayNames]}
                    </span>
                    <div className="absolute left-0 p-2 mt-2 text-sm text-white bg-gray-900/95 rounded invisible group-hover:visible w-64 transition-all z-10 shadow-lg">
                      {parameterDescriptions[parameter as keyof typeof parameterDescriptions]}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleWeightChange(parameter, parseInt(e.target.value))}
                    className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 w-[300px]"
                  />
                  <span className="w-16 text-right font-mono text-red-400">{Math.round(value)}</span>
                </div>
              ))}
            </div>
            {/* Only show Calculate button if results aren't shown yet */}
            {!showResults && (
              <button 
                onClick={calculateRankings}
                className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Calculate
              </button>
            )}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-8">
              {/* First Box: Team Info + Radar */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl font-semibold mb-6">Results</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold">
                    Your Bias is Likely to be <span className="text-red-500">{rankedTeams[0]?.name}</span>
                  </h3>
                </div>

                {rankedTeams.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-center mb-6">Your Best F1 Team Match:</h2>
                    <div className="grid grid-cols-2 gap-8">
                      {/* Team Info Panel */}
                      <div className="bg-zinc-900/80 p-6 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                          <img 
                            src={rankedTeams[0].logo} 
                            alt={rankedTeams[0].name} 
                            className="h-16 w-auto"
                          />
                          <h3 className="text-2xl font-bold">{rankedTeams[0].name}</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-lg font-semibold mb-1">Current Drivers:</p>
                            <p>{teamDetails[rankedTeams[0].name].drivers.join(' & ')}</p>
                          </div>
                          
                          <div>
                            <p className="text-lg font-semibold mb-1">Based in:</p>
                            <p>{teamDetails[rankedTeams[0].name].country}</p>
                          </div>
                          
                          <div>
                            <p className="text-lg font-semibold mb-1">Team Identity:</p>
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

              {/* Second Box: Complete Rankings */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Complete Rankings</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Rankings List */}
                  <div className="space-y-4">
                    {rankedTeams.map((team, index) => (
                      <div 
                        key={team.id} 
                        className="flex items-center gap-4 bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-colors"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 font-bold">
                          {index + 1}
                        </div>
                        <img 
                          src={team.logo} 
                          alt={`${team.name} logo`} 
                          className="h-8 w-8 object-contain"
                        />
                        <div className="flex-grow flex justify-between items-center">
                          <span className="font-semibold">{team.name}</span>
                          <span className="font-mono text-red-500">
                            {(team.weightedScore ?? 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-zinc-900/30 rounded-lg p-4">
                    <Bar
                      data={{
                        labels: rankedTeams.map(team => team.name),
                        datasets: [{
                          label: 'Team Score',
                          data: rankedTeams.map(team => team.weightedScore),
                          backgroundColor: rankedTeams.map(team => team.color),
                          borderColor: rankedTeams.map(team => team.color),
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        indexAxis: 'y',
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                          x: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                              color: '#fff'
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              color: '#fff'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }}
                      style={{ height: '500px', width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer without margins */}
      <footer className="bg-zinc-900/80 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">F1 Team Bias Finder</h4>
              <p className="text-zinc-400 text-sm">
                A fan-made tool to help you discover which Formula 1 team aligns with your preferences.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Disclaimer</h4>
              <p className="text-zinc-400 text-sm">
                This is an unofficial Formula 1 website. F1, FORMULA ONE, and related marks are trademarks of Formula One Licensing B.V.
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
                    href="https://github.com/yourusername/your-repo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors"
                  >
                    GitHub Repository
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
                href="https://your-website.com" 
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