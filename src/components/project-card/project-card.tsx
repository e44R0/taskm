import { Project } from '@/types/project';
import styles from './card.module.css';
import { formatDate } from '../utils';
import { deleteProject } from '@/api/delete-project';
import { useState } from 'react';
import { updateProject } from '@/api/update-project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Save, Trash2, X } from 'lucide-react';
import router from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface CardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard = (props: CardProps) => {
  const [isEditMode, setEditMode] = useState(false);
  const {
    project: { id, title, tags, username, isFavorite, createdAt },
    onDelete,
  } = props;

  const [initialTitle, setInitialTitle] = useState(title);
  const [initialTags, setInitialTags] = useState(tags);
  const [initialFavorite, setIsFavorite] = useState(isFavorite);

  const removeTagHandler = (tagToRemove: string) => {
    setInitialTags(initialTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Если клик был по интерактивному элементу - не переходить
    const interactiveElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SPAN'];
    if (interactiveElements.includes((e.target as HTMLElement).tagName)) {
      return;
    }
    router.push(`/projects/${id}`);
  };

  const deleteHandler = async () => {
    try {
      await deleteProject(id);
      onDelete();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!initialFavorite);
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
    <Card
      className={`${styles.card} rounded-md group p-3 border-[#2a2a2a]`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="pb-2">
          <div className="flex pb-2">
            <div
              className="text-lg font-semibold text-gray-300 line-clamp-2 flex-1 mr-2"
              // placeholder="Название проекта"
            >
              {initialTitle}
            </div>
            <button
              onClick={toggleFavorite}
              className="focus:outline-none"
              aria-label={
                initialFavorite
                  ? 'Убрать из избранного'
                  : 'Добавить в избранное'
              }
            >
              <span
                className={` ${initialFavorite ? 'text-red-400' : 'text-zinc-700'}`}
              >
                {'<3'}
              </span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {initialTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className=" text-xs px-2 py-1 rounded-sm bg-[#1c1c1c] text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer group/tag"
              >
                {tag}
                {/*<X className="h-3 w-3 ml-1 opacity-0 group-hover/tag:opacity-100 transition-opacity" />*/}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://cdn-icons-png.flaticon.com/512/126/126486.png}`}
                alt={username}
              />
              <AvatarFallback className="text-xs bg-gradient-to-br from-zinc-600 to-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                {/*{getInitials(owner.name)}*/}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <span className="text-sm font-medium text-zinc-200">
                {username}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(createdAt)}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditMode(!isEditMode);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:text-zinc-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  ) : (
    <Card
      className={`${styles.card} rounded-md group p-3 border-[#2a2a2a]`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="pb-2">
          <div className="flex pb-2">
            <div
              className="text-lg font-semibold text-gray-300 line-clamp-2 flex-1 mr-2"
              // placeholder="Название проекта"
            >
              <input
                type="text"
                value={initialTitle}
                onChange={(e) => setInitialTitle(e.target.value)}
              />
            </div>
            <button
              onClick={toggleFavorite}
              className="focus:outline-none"
              aria-label={
                initialFavorite
                  ? 'Убрать из избранного'
                  : 'Добавить в избранное'
              }
            >
              <span
                className={` ${initialFavorite ? 'text-red-400' : 'text-zinc-700'}`}
              >
                {'<3'}
              </span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {initialTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                onClick={() => {
                  removeTagHandler(tag);
                }}
                className=" text-xs px-2 py-1 rounded-sm bg-[#1c1c1c] text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer group/tag"
              >
                {tag}
                <X className="h-3 w-3 ml-1  group-hover/tag:opacity-100 transition-opacity" />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://cdn-icons-png.flaticon.com/512/126/126486.png}`}
                alt={username}
              />
              <AvatarFallback className="text-xs bg-gradient-to-br from-zinc-600 to-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                {/*{getInitials(owner.name)}*/}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <span className="text-sm font-medium text-zinc-200">
                {username}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(createdAt)}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditMode(!isEditMode);
              }}
              className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-200 text-xs px-2"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteHandler}
              className="bg-red-900/50 border-red-700 hover:bg-red-800/50 text-red-200 text-xs px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveHandler}
              className="bg-green-900/50 border-green-700 hover:bg-green-800/50 text-green-200 text-xs px-2"
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
    // <div className={styles.card}>
    //   <div>
    //     <div>
    //       <label>Title:</label>
    //       <input
    //         type="text"
    //         value={initialTitle}
    //         onChange={(e) => setInitialTitle(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label>Tags:</label>
    //       <input
    //         type="text"
    //         value={initialTags.join(', ')}
    //         onChange={(e) => {
    //           setInitialTags(e.target.value.split(', '));
    //         }}
    //         onBlur={(e) => {
    //           const tags = e.target.value
    //             .split(',')
    //             .map((tag) => tag.trim())
    //             .filter((tag) => tag.length > 0);
    //           setInitialTags(tags);
    //         }}
    //       />
    //     </div>
    //     <div>Owner: {username}</div>
    //     <div>Favorite: {isFavorite ? 'true' : 'false'}</div>
    //     <div>{formatDate(createdAt)}</div>
    //   </div>
    //   <div className="flex justify-between">
    //     <button
    //       className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
    //       onClick={() => {
    //         setEditMode(false);
    //       }}
    //     >
    //       Cancel
    //     </button>
    //     <button
    //       className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
    //       onClick={deleteHandler}
    //     >
    //       Delete
    //     </button>
    //     <button
    //       className="bg-[#1c1c1c] text-white px-4 py-1 text-sm hover:bg-[#2a2a2a]"
    //       onClick={saveHandler}
    //     >
    //       Save
    //     </button>
    //   </div>
    // </div>
  );
};
