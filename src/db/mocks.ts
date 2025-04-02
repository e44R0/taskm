import db from './db'

function createUsers() {
  const users = [
    {
      id: '1',
      username: 'alice',
      email: 'alice@example.com',
      password: 'password',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'bob',
      email: 'bob@example.com',
      password: 'password',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'charlie',
      email: 'charlie@example.com',
      password: 'password',
      createdAt: new Date().toISOString(),
    },
  ]

  users.forEach((user) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(user.id, user.username, user.email, user.password, user.createdAt)
  })
}

function createProjects() {
  const projects = [
    {
      id: '1',
      title: 'Project Alpha',
      owner: 'alice',
      isFavorite: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Project Beta',
      owner: 'bob',
      isFavorite: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Project Gamma',
      owner: 'charlie',
      isFavorite: true,
      createdAt: new Date().toISOString(),
    },
  ]

  projects.forEach((project) => {
    const stmt = db.prepare(`
      INSERT INTO projects (id, title, owner, is_favorite, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(
      project.id,
      project.title,
      project.owner,
      project.isFavorite ? 1 : 0,
      project.createdAt
    )
  })
}

// Функция для создания областей (Areas) внутри проектов
function createAreas() {
  const areas = [
    { id: '1', title: 'To Do', projectId: '1' },
    { id: '2', title: 'In Progress', projectId: '1' },
    { id: '3', title: 'Completed', projectId: '1' },

    { id: '4', title: 'Backlog', projectId: '2' },
    { id: '5', title: 'To Do', projectId: '2' },

    { id: '6', title: 'Ideas', projectId: '3' },
    { id: '7', title: 'To Do', projectId: '3' },
  ]

  areas.forEach((area) => {
    const stmt = db.prepare(`
      INSERT INTO areas (id, title, project_id)
      VALUES (?, ?, ?)
    `)
    stmt.run(area.id, area.title, area.projectId)
  })
}

// Функция для создания задач (Tasks) в этих областях
function createTasks() {
  const tasks = [
    {
      taskId: '1',
      text: 'Finish setting up project structure',
      taskOwner: 'alice',
      createdAt: new Date().toISOString(),
      projectId: '1',
      areaId: '1',
    },
    {
      taskId: '2',
      text: 'Implement authentication',
      taskOwner: 'bob',
      createdAt: new Date().toISOString(),
      projectId: '1',
      areaId: '2',
    },
    {
      taskId: '3',
      text: 'Write unit tests',
      taskOwner: 'charlie',
      createdAt: new Date().toISOString(),
      projectId: '1',
      areaId: '3',
    },

    {
      taskId: '4',
      text: 'Create wireframes',
      taskOwner: 'bob',
      createdAt: new Date().toISOString(),
      projectId: '2',
      areaId: '4',
    },
    {
      taskId: '5',
      text: 'Define project scope',
      taskOwner: 'alice',
      createdAt: new Date().toISOString(),
      projectId: '2',
      areaId: '5',
    },

    {
      taskId: '6',
      text: 'Brainstorm features',
      taskOwner: 'charlie',
      createdAt: new Date().toISOString(),
      projectId: '3',
      areaId: '6',
    },
    {
      taskId: '7',
      text: 'Create project timeline',
      taskOwner: 'bob',
      createdAt: new Date().toISOString(),
      projectId: '3',
      areaId: '7',
    },
  ]

  tasks.forEach((task) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (task_id, text, task_owner, created_at, project_id, area_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      task.taskId,
      task.text,
      task.taskOwner,
      task.createdAt,
      task.projectId,
      task.areaId
    )
  })
}

// Функция для создания связей пользователей с проектами
function addUserToProjects() {
  const projectUsers = [
    { projectId: '1', userId: '1', role: 'owner' },
    { projectId: '1', userId: '2', role: 'member' },
    { projectId: '1', userId: '3', role: 'member' },

    { projectId: '2', userId: '2', role: 'owner' },
    { projectId: '2', userId: '1', role: 'member' },

    { projectId: '3', userId: '3', role: 'owner' },
    { projectId: '3', userId: '1', role: 'member' },
  ]

  projectUsers.forEach((projectUser) => {
    const stmt = db.prepare(`
      INSERT INTO project_users (project_id, user_id, role)
      VALUES (?, ?, ?)
    `)
    stmt.run(projectUser.projectId, projectUser.userId, projectUser.role)
  })
}

// Заполнение базы моковыми данными
export function fillDatabaseWithMocks() {
  createUsers()
  createProjects()
  createAreas()
  createTasks()
  addUserToProjects()
  console.log('Моковые данные успешно добавлены в базу!')
}
