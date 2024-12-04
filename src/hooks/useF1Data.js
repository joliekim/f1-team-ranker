import { useState, useEffect } from 'react';
import { f1Api } from '../services/f1Api';

export const useF1Data = () => {
    const [teams, setTeams] = useState([]);
    const [performance, setPerformance] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const teamsData = await f1Api.getTeams();
                const performanceData = await f1Api.getTeamPerformance();

                setTeams(teamsData);
                setPerformance(performanceData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { teams, performance, loading, error };
}; 