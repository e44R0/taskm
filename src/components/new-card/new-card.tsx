import { Project } from '@/types/project';
// import styles from './new-card.module.css';
import { useState } from 'react';
import { createProject } from '@/api/create-project';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <Card className={`rounded-md group p-3 border-[#2a2a2a]`}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full  border border-[#1c1c1c] rounded"
        />
      </div>
      <div>
        <label htmlFor="tags">Tags:</label>
        <input
          name="tags"
          value={tags.join(',')}
          onChange={(e) => setTags(e.target.value.split(','))}
          className="w-full border border-[#1c1c1c] rounded"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={cancelNewProjectHandler}
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-200 text-xs px-2"
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createNewProjectHandler}
          className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-200 text-xs px-2"
        >
          Create
        </Button>
      </div>
    </Card>
  );
};
