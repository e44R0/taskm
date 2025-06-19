import { Card } from '@/components/card/card';
import style from './project-list.module.css';
import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
import { createProject } from '@/api/create-project';

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  // [isCreationMode] = useState()
  const router = useRouter();

  useEffect(() => {
    fetcher({ method: 'GET', src: '/api/projects', router })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error(error));
  }, [router]);

  const addNewProjectHandler = () => {
    createProject({ title: 'New Project', tags: ['one', 'two'] })
      .then((newProject) => {
        console.log(newProject);
        setProjects((prevProjects) => [...prevProjects, newProject]);
      })
      .catch((err) => {
        console.log('Ошибка при создании проекта: ', err);
      });
  };

  return (
    <div className={style.projectList}>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
      {/* isCreationMode && <Card /> */}
      <div>
        <button className="" onClick={addNewProjectHandler}>
          +
        </button>
      </div>
    </div>
  );
};
