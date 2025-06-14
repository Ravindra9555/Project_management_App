// In: app/dashboard/projects/[projectId]/tasks/refetch.ts
import axios from "axios";
import { ProjectDetails, Task } from "./components/types";

// This function fetches all necessary data for the page
export const fetchTaskPageData = async (projectId: string, token: string | null): Promise<{ project: ProjectDetails; tasks: Task[] }> => {
    if (!projectId || !token) {
        throw new Error("Missing Project ID or Token");
    }

    const [projectRes, tasksRes] = await Promise.all([
        axios.get(`/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`/api/projects/tasks?projectId=${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
    ]);
    
    return {
        project: projectRes.data.project,
        tasks: tasksRes.data.data,
    };
};