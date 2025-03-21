import { Area } from "./area";

export interface Project {
  id: string;
  title: string;
  tags: string[];
  owner: string;
  isFavorite: boolean;
  createdAt: string;
  areas: Area[];
}
