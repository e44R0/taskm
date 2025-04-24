import { useRouter } from 'next/router';
import { Project as TProject } from '@/types/project';
import { Project } from '@/components/project/project';
import { useEffect, useState } from 'react';
import { Area } from '@/types/area';

export default function ProjectID() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<TProject>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateProjectWithArea = (
    area: Area,
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

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/project/${id}`);

          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }

          const data = await response.json();
          setProject(data);
        } catch (error) {
          setError((error as Error).message);
          console.error('Ошибка при получении проекта:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id]);

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
      <Project
        project={project}
        updateProjectWithArea={updateProjectWithArea}
      />
    </div>
  );
}
