import { Card } from '@/components/card/card';
import style from './project-list.module.css';
import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  console.log('projects page');
  useEffect(() => {
    fetcher({ method: 'GET', src: '/api/projects', router })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error(error));
  }, [router]);

  return (
    <div className={style.projectList}>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
    </div>
  );
};
