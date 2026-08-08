import { ApiResponse, simulatedDelay } from './api';

export interface RepositoryStats {
  stars: number;
  forks: number;
  openIssues: number;
}

export const fetchRepoStats = async (
  repoName: string
): Promise<ApiResponse<RepositoryStats>> => {
  await simulatedDelay(300);
  return {
    success: true,
    message: 'Stats fetched successfully',
    data: {
      stars: Math.floor(Math.random() * 80) + 20,
      forks: Math.floor(Math.random() * 15) + 5,
      openIssues: Math.floor(Math.random() * 3),
    },
  };
};
