import { Project } from '@/types/project';
import styles from './card.module.css';
import Link from 'next/link';
import { formatDate } from '../utils';
import { deleteProject } from '@/api/delete-project';
import { useState } from 'react';
import { updateProject } from '@/api/update-project';

interface CardProps {
  project: Project;
  onDelete: () => void;
}

export const Card = (props: CardProps) => {
  const [isEditMode, setEditMode] = useState(false);
  const {
    project: { id, title, tags, username, isFavorite, createdAt },
    onDelete,
  } = props;

  const [initialTitle, setInitialTitle] = useState(title);
  const [initialTags, setInitialTags] = useState(tags);

  const deleteHandler = async () => {
    try {
      await deleteProject(id);
      onDelete();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const saveHandler = async (): Promise<void> => {
    const projectData = {
      id,
      title: initialTitle,
      tags: initialTags,
      username,
      isFavorite: isFavorite,
      createdAt,
    };

    try {
      // setErrorMessage(null);
      updateProject(projectData).then((data) => {
        setEditMode(!isEditMode);
        console.log('data: ', data);
      });
    } catch (error) {
      // setErrorMessage((error as Error).message)
      console.error((error as Error).message);
    }
  };

  return !isEditMode ? (
    <div className={styles.card}>
      <Link href={`/projects/${id}`}>
        <div>Title: {initialTitle}</div>
        <div>Tags: {initialTags.join(', ')}</div>
        <div>Owner: {username}</div>
        <div>Favorite: {isFavorite ? 'true' : 'false'}</div>
        <div>{formatDate(createdAt)}</div>
      </Link>
      <div className="flex justify-between">
        <button
          className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
          onClick={() => {
            setEditMode(true);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.card}>
      <div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={initialTitle}
            onChange={(e) => setInitialTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            value={initialTags.join(', ')}
            onChange={(e) => {
              setInitialTags(e.target.value.split(', '));
            }}
            onBlur={(e) => {
              const tags = e.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
              setInitialTags(tags);
            }}
          />
        </div>
        <div>Owner: {username}</div>
        <div>Favorite: {isFavorite ? 'true' : 'false'}</div>
        <div>{formatDate(createdAt)}</div>
      </div>
      <div className="flex justify-between">
        <button
          className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
          onClick={() => {
            setEditMode(false);
          }}
        >
          Cancel
        </button>
        <button
          className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
          onClick={deleteHandler}
        >
          Delete
        </button>
        <button
          className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
          onClick={saveHandler}
        >
          Save
        </button>
      </div>
    </div>
  );
};
