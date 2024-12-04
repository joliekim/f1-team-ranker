import React from 'react';
import { Card, Title, Text, Metric } from '@tremor/react';
import { motion } from 'framer-motion';

const TeamResults = ({ scores, onTeamSelect, selectedTeam }) => {
    return (
        <Card>
            <Title>Team Rankings</Title>
            <div className="mt-4 space-y-2">
                {scores.map((team, index) => (
                    <motion.div
                        key={team.team}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <button
                            onClick={() => onTeamSelect(team)}
                            className={`w-full p-4 rounded-lg transition-all ${
                                selectedTeam?.team === team.team
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white hover:bg-gray-50'
                            } border flex items-center justify-between`}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl font-bold text-gray-500">
                                    {index + 1}
                                </span>
                                <div className="flex flex-col items-start">
                                    <Text>{team.team}</Text>
                                    <div className="flex space-x-2">
                                        {team.badges?.map((badge, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Metric>{team.score.toFixed(1)}</Metric>
                        </button>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

export default TeamResults;