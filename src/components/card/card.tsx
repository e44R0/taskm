import { Project } from '@/types/project';
import styles from './card.module.css';
import Link from 'next/link';
import { formatDate } from '../utils';

// import { formatDate } from '@/utils/utils'

interface CardProps {
  project: Project;
}

export const Card = (props: CardProps) => {
  const {
    project: { id, title, tags, username, isFavorite, createdAt },
  } = props;

  return (
    <Link href={`/projects/${id}`} className={styles.card}>
      <div>Title: {title}</div>
      <div>Tags: {tags}</div>
      <div>Owner: {username}</div>
      <div>Favorite: {isFavorite ? 'true' : 'false'}</div>
      <div>{formatDate(createdAt)}</div>
      <div className="flex justify-between">
        <button className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]">
          Edit
        </button>
        <button className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]">
          Delete
        </button>
      </div>
    </Link>
  );
};
