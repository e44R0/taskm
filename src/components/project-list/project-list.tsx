import { Card } from '@/components/card/card'
import style from './project-list.module.css'
import { useEffect, useState } from 'react'
import { Project } from '@/types/project'

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects')
      .then((response) => {
        response.json().then((data) => {
          setProjects(data)
        })
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <div className={style.projectList}>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
    </div>
  )
}
