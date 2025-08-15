import { ProjectCard } from '@/components/project-card/project-card';
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

  const deleteProjectHandler = (projectId: string) => {
    const projectIndex = projects.findIndex(
      (project) => project.id === projectId
    );

    if (projectIndex !== -1) {
      projects.splice(projectIndex, 1);
      setProjects([...projects]);
    }
  };

  return (
    <div className={style.projectList}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={() => deleteProjectHandler(project.id)}
        />
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
          className="w-full border border-[#2a2a2a] text-gray-300 text-sm hover:bg-[#2a2a2a] transition-colors rounded-sm"
          onClick={addNewProjectHandler}
        >
          Create New Project
        </button>
      </div>
    </div>
  );
};
