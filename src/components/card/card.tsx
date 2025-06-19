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
    </Link>
  );
};
