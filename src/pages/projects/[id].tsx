import { useRouter } from 'next/router';
import { Project } from '@/components/project/project';
import { useEffect, useState } from 'react';
import { FE } from '@/types/frontend';
import { fetchProject } from '@/api/get-projects';
import { Navigation } from '@/components/navigation/navigation';
import { updateTask } from '@/api/update-task';
import { createTask } from '@/api/create-task';
import { deleteTask } from '@/api/delete-task';

export default function ProjectID() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<FE.ProjectWithAreas>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateProjectWithArea = (
    area: FE.Area,
    action: 'add' | 'update' | 'delete'
  ) => {
    setProject((prevProject) => {
      if (!prevProject) return prevProject;

      const areas = [...(prevProject?.areas ?? [])];
      const index = areas.findIndex((a) => a.id === area.id);

      if (index === -1 && action === 'add') {
        areas.push(area);
      } else if (index !== -1 && action === 'delete') {
        areas.splice(index, 1);
      } else if (index !== -1 && action === 'update') {
        areas[index] = area;
      }

      return { ...prevProject, areas };
    });
  };

  // projects/[id]?x=1&y=2
  // foo/bar?x=1&x=2

  const updateTaskInProject = (task: FE.Task) => {
    console.log('Task to update:', task);
    try {
      // setErrorMessage(null);
      updateTask(task).then((updatedTask) => {
        setProject((prevProject) => {
          if (!prevProject) return prevProject;

          console.log('updatedTask from BE:', updatedTask);
          return {
            ...prevProject,
            areas: prevProject.areas.map((area) => {
              const taskIndex = area.tasks.findIndex(
                (t) => t.taskId === updatedTask.taskId
              );
              if (taskIndex === -1) return area;

              const updatedTasks = [...area.tasks];
              updatedTasks[taskIndex] = {
                ...area.tasks[taskIndex],
                ...updatedTask,
              };

              return {
                ...area,
                tasks: updatedTasks,
              };
            }),
          };
        });
        setProject((proj) => {
          console.log('project:', proj);
          return proj;
        });
      });
    } catch (error) {
      // setErrorMessage((error as Error).message)
      console.error((error as Error).message);
    }
  };

  const addNewTaskInProject = async (area: FE.Area) => {
    const areaData = { projectId: project!.id, areaId: area.id };

    try {
      createTask(areaData).then(() => console.log('Новая задача создана'));
    } catch (error) {
      console.error('Ошибка при добавлении нового таска:', error);
    }
  };

  const deleteTaskInProject = async (taskId: string) => {
    await deleteTask(taskId);

    setProject((prevProject) => {
      if (!prevProject) return prevProject;

      return {
        ...prevProject,
        areas: prevProject.areas.map((area) => {
          const taskIndex = area.tasks.findIndex((t) => t.taskId === taskId);
          if (taskIndex === -1) return area;

          const updatedTasks = area.tasks.filter(
            (task) => taskId !== task.taskId
          );

          return {
            ...area,
            tasks: updatedTasks,
          };
        }),
      };
    });
  };

  useEffect(() => {
    if (id) {
      fetchProject(id as string, router)
        .then((data) => {
          setLoading(false);
          setProject(data);
        })
        .catch((error) => {
          setLoading(false);
          setError(error.toString());
        });
    }
  }, [id, router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!project) {
    return <div>Проект не найден.</div>;
  }

  return (
    <div className="flex">
      <Navigation />
      <Project
        project={project}
        updateProjectWithArea={updateProjectWithArea}
        updateTaskInProject={updateTaskInProject}
        addNewTaskInProject={addNewTaskInProject}
        deleteTaskInProject={deleteTaskInProject}
      />
    </div>
  );
}
