import { Project } from '@/types/project'
import styles from './card.module.css'
import Link from 'next/link'
// import { formatDate } from '@/utils/utils'

interface CardProps {
  project: Project
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const Card = (props: CardProps) => {
  const {
    project: { id, title, tags, owner, isFavorite, createdAt },
  } = props

  return (
    <Link href={`/projects/${id}`} className={styles.card}>
      <div>Title: {title}</div>
      <div>Tags: {tags}</div>
      <div>Owner: {owner}</div>
      <div>Favorite: {isFavorite ? 'true' : 'false'}</div>
      <div>{formatDate(createdAt)}</div>
    </Link>
  )
}
