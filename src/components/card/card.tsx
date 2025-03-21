import { Project } from "@/types/project";
import styles from "./card.module.css";
import Link from "next/link";

interface CardProps {
  project: Project;
}

export const Card = (props: CardProps) => {
  const {
    project: { id, title, tags, owner, isFavorite, createdAt },
  } = props;
  return (
    <Link href={`/projects/${id}`} className={styles.card}>
      <div>Title: {title}</div>
      <div>Tags: {tags.join(", ")}</div>
      <div>Owner: {owner}</div>
      <div>Favorite: {isFavorite ? "true" : "false"}</div>
      <div>Date: {createdAt}</div>
    </Link>
  );
};
