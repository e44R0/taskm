import { useRouter } from 'next/router';
import { Project } from '@/components/project/project';
import { useEffect, useState } from 'react';
import { FE } from '@/types/frontend';
import { fetchProject } from '@/api/get-projects';
import { Navigation } from '@/components/navigation/navigation';

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
      />
    </div>
  );
}
