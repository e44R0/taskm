import { Card } from '@/components/card/card';
import style from './project-list.module.css';
import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
// import { createProject } from '@/api/create-project';
import { NewCard } from '../new-card/new-card';

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreationMode, setIsCreationMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetcher({ method: 'GET', src: '/api/projects', router })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error(error));
  }, [router]);

  const addNewProjectHandler = () => {
    setIsCreationMode(true);
  };

  return (
    <div className={style.projectList}>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
      {isCreationMode && (
        <NewCard
          onProjectCreated={(project) => {
            setProjects((prevProjects) => [...prevProjects, project]);
            setIsCreationMode(false);
          }}
          onCansel={() => {
            setIsCreationMode(false);
          }}
        />
      )}
      <div>
        <button
          className="p-2 m-8 mx-2 max-w-[300px] min-w-[300px] bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
          onClick={addNewProjectHandler}
        >
          Create New Project
        </button>
      </div>
    </div>
  );
};
