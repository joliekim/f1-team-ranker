# Reload the necessary libraries and files
import pandas as pd

# Reload all files
aggregated_driver_points = pd.read_csv('/mnt/data/aggregated_driver_points_2024.csv')
constructor_results = pd.read_csv('/mnt/data/constructor_results.csv')
constructor_standings = pd.read_csv('/mnt/data/constructor_standings.csv')
current_f1_drivers = pd.read_csv('/mnt/data/current_f1_drivers_2024.csv')
current_f1_teams = pd.read_csv('/mnt/data/current_f1_teams.csv')
driver_standings = pd.read_csv('/mnt/data/driver_standings.csv')
scaled_metrics = pd.read_csv('/mnt/data/Scaled_F1_Team_and_Driver_Metrics.csv')
seasons = pd.read_csv('/mnt/data/seasons.csv')
results = pd.read_csv('/mnt/data/results.csv')

# Repeat the processing
recent_years = [2022, 2023, 2024]
constructor_standings_recent = constructor_standings.merge(results[['raceId', 'constructorId']], 
                                                           on='constructorId', how='inner')

constructor_standings_recent = constructor_standings_recent[
    constructor_standings_recent['raceId'].isin(recent_years)
]

# Performance calculations
performance = constructor_standings_recent.groupby('constructorId').agg({
    'wins': 'sum',
    'points': 'sum'
}).reset_index()

performance['performance_score'] = (
    (performance['wins'] / performance['wins'].max()) * 0.5 +
    (performance['points'] / performance['points'].max()) * 0.5
)

# Growth Rate calculations
growth_rate = constructor_standings_recent.groupby(['constructorId', 'raceId']).agg({
    'position': 'min'
}).reset_index()

growth_rate_diff = growth_rate.groupby('constructorId').agg({
    'position': lambda x: max(x) - min(x)
}).reset_index()

growth_rate_diff['growth_rate_score'] = (
    (growth_rate_diff['position'] / growth_rate_diff['position'].max())
)

# Heritage calculations
constructor_years = seasons.merge(current_f1_teams[['constructorId']], how='inner')
constructor_years_agg = constructor_years.groupby('constructorId').agg({
    'year': ['min', 'max']
}).reset_index()
constructor_years_agg.columns = ['constructorId', 'start_year', 'end_year']
constructor_years_agg['total_years'] = constructor_years_agg['end_year'] - constructor_years_agg['start_year']

heritage = constructor_years_agg[['constructorId', 'total_years']].copy()
heritage['heritage_score'] = heritage['total_years'] / heritage['total_years'].max()

# Merge all scores
team_scores = performance[['constructorId', 'performance_score']].merge(
    growth_rate_diff[['constructorId', 'growth_rate_score']], on='constructorId'
).merge(
    heritage[['constructorId', 'heritage_score']], on='constructorId'
)

# Add placeholder columns for resilience and underdog spirit
team_scores['resilience_score'] = 0  # Placeholder
team_scores['underdog_spirit_score'] = 0  # Placeholder

# Save the results to a CSV file for user download
output_file_path = '/mnt/data/F1_Team_Parameter_Scores.csv'
team_scores.to_csv(output_file_path, index=False)

output_file_path