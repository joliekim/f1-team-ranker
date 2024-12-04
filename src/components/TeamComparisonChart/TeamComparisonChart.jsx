import React from 'react';
import { Card, Title } from '@tremor/react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
} from 'recharts';

const TeamComparisonChart = ({ teams, parameters }) => {
    const chartData = parameters.map(param => ({
        parameter: param.name,
        ...teams.reduce((acc, team) => ({
            ...acc,
            [team.team]: team.parameterScores?.[param.id] || 0
        }), {})
    }));

    return (
        <Card>
            <Title>Top Teams Comparison</Title>
            <div className="w-full h-[400px] mt-4">
                <RadarChart
                    width={500}
                    height={400}
                    data={chartData}
                    className="mx-auto"
                >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="parameter" />
                    <PolarRadiusAxis />
                    {teams.map((team, index) => (
                        <Radar
                            key={team.team}
                            name={team.team}
                            dataKey={team.team}
                            stroke={`hsl(${index * 45}, 70%, 50%)`}
                            fill={`hsl(${index * 45}, 70%, 50%)`}
                            fillOpacity={0.3}
                        />
                    ))}
                    <Legend />
                </RadarChart>
            </div>
        </Card>
    );
};

export default TeamComparisonChart;