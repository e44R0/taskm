import { Project } from '@/types/project';
import styles from './new-card.module.css';
import { useState } from 'react';
import { createProject } from '@/api/create-project';

type NewCardProps = {
  onProjectCreated: (project: Project) => void;
  onCansel: () => void;
};

export const NewCard = (props: NewCardProps) => {
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const cancelNewProjectHandler = () => {
    props.onCansel();
  };

  const createNewProjectHandler = () => {
    createProject({ title, tags })
      .then((newProject) => {
        console.log(newProject);
        props.onProjectCreated(newProject);
      })
      .catch((err) => {
        console.log('Ошибка при создании проекта: ', err);
      });
  };

  return (
      <div className={`${styles.newCard} flex flex-col`}>
          <div>
              <label htmlFor="title">Title:</label>
              <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#1c1c1c] rounded p-1"
              />
          </div>
          <div className="mt-2">
              <label htmlFor="tags">Tags:</label>
              <input
                  name="tags"
                  value={tags.join(',')}
                  onChange={(e) => setTags(e.target.value.split(','))}
                  className="w-full border border-[#1c1c1c] rounded p-1"
              />
          </div>

          {/* Кнопки прижаты к низу благодаря mt-auto */}
          <div className="mt-auto flex justify-between">
              <button
                  className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a] rounded"
                  onClick={cancelNewProjectHandler}
              >
                  Cancel
              </button>
              <button
                  className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a] rounded"
                  onClick={createNewProjectHandler}
              >
                  Create
              </button>
          </div>
      </div>
  );
};
