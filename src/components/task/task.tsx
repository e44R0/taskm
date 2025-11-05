import { FE } from '@/types/frontend';
import { useEffect, useState } from 'react';
import { updateTask } from '@/api/update-task';
import { deleteTask } from '@/api/delete-task';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  Calendar,
  CheckCircle,
  Circle,
  Edit,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TaskProps {
  areaId: string;
  task: FE.Task;
  onDelete: () => void;
  updateTaskInProject: (task: FE.Task) => void;
}

export const Task = (props: TaskProps) => {
  const {
    task: { taskId, tags, text, status, taskOwner, createdAt },
    task,
    onDelete,
    updateTaskInProject,
  } = props;

  // console.log('task:', task);
  const [completed, setCompleted] = useState(status === 'completed');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(text);
  const [editTags, setEditTags] = useState(tags);
  const [newTag, setNewTag] = useState('');

  const handleCompleteClick = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    // onToggleComplete?.(taskId, newCompletedState);
  };

  const handleSaveClick = () => {
    const taskData = {
      taskId,
      text: editTitle,
      tags: editTags,
      status: status,
      taskOwner,
      createdAt,
    };

    try {
      // setErrorMessage(null);
      updateTask(taskData).then((updatedTask) => {
        // console.log('updatedTask.tags:', updatedTask.tags);
        updateTaskInProject(updatedTask);
        // setEditTitle(updatedTask.text);
        // console.log('updatedTask:', updatedTask);
        setEditMode(!editMode);
      });
    } catch (error) {
      // setErrorMessage((error as Error).message)
      console.error((error as Error).message);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditTitle(text);
    setEditTags([...tags]);
    setNewTag('');
  };

  const handleDeleteClick = async () => {
    try {
      onDelete();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    if (dateString.includes('T') || dateString.includes(':')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // useEffect(() => {
  //   setEditTitle(text);
  //   setEditTags(tags);
  //   setCompleted(status === 'completed');
  // }, [text, tags, status]);

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 group bg-zinc-900/50 border-zinc-800 backdrop-blur-sm gap-2 p-4">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            {!editMode && (
              <button
                onClick={handleCompleteClick}
                className="flex-shrink-0 mt-0.5 text-zinc-400 hover:text-green-400 transition-colors"
                aria-label={
                  completed
                    ? 'Отметить как невыполненную'
                    : 'Отметить как выполненную'
                }
              >
                {completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
            )}
            {editMode ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-sm font-medium bg-zinc-800 border-zinc-700 text-white flex-1"
                placeholder="Название задачи"
              />
            ) : (
              <h4
                className={`text-sm font-medium flex-1 line-clamp-2 ${
                  completed ? 'text-zinc-400 line-through' : 'text-white'
                }`}
              >
                {text}
              </h4>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {editMode ? (
            <div className="w-full space-y-2">
              <div className="flex flex-wrap gap-1">
                {editTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer group/tag"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="h-2 w-2 ml-1 opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Новый тег"
                  className="text-xs bg-zinc-800 border-zinc-700 text-white"
                />
                <Button
                  size="sm"
                  onClick={addTag}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-2"
                >
                  +
                </Button>
              </div>
            </div>
          ) : (
            editTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-300 border-zinc-700"
              >
                {tag}
              </Badge>
            ))
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/person.png`} alt={taskOwner} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-zinc-600 to-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                {getInitials(taskOwner)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200">
                {taskOwner}
              </span>
              <div className="flex items-center text-xs text-zinc-400">
                <Calendar className="h-2.5 w-2.5 mr-1" />
                {formatDate(createdAt)}
              </div>
            </div>
          </div>

          {editMode ? (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelClick}
                className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-200 text-xs px-1.5 h-6"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="bg-red-900/50 border-red-700 hover:bg-red-800/50 text-red-200 text-xs px-1.5 h-6"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveClick}
                className="bg-green-900/50 border-green-700 hover:bg-green-800/50 text-green-200 text-xs px-1.5 h-6"
              >
                <Save className="h-2.5 w-2.5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditMode(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-200 text-xs px-1.5 h-6"
            >
              <Edit className="h-2.5 w-2.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
