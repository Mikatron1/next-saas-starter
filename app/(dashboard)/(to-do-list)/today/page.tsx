"use client"

import { useState } from 'react'
import { Search, ChevronRight, Calendar, StickyNote, Plus, Settings, LogOut, Menu, X } from 'lucide-react'

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  date?: string;
  subtasks?: Subtask[];
  tag?: string;
  list?: string;
}

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Research content ideas', completed: false },
    { id: 2, title: 'Create a database of guest authors', completed: false },
    { id: 3, title: 'Renew driver\'s license', completed: false, date: '22-03-22', subtasks: [{ id: 31, title: 'Subtask 1', completed: false }], tag: 'Personal' },
    { id: 4, title: 'Consult accountant', completed: false, list: 'List 1', subtasks: [{ id: 41, title: 'Subtask 1', completed: false }, { id: 42, title: 'Subtask 2', completed: false }, { id: 43, title: 'Subtask 3', completed: false }] },
    { id: 5, title: 'Print business card', completed: false },
  ])

  const [isExpanded, setIsExpanded] = useState(true)
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    completed: false,
    list: 'Personal',
    date: '',
    tag: '',
    subtasks: []
  })

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const openTaskPanel = (task: Task | null = null) => {
    if (task) {
      setCurrentTask({
        ...task,
        subtasks: task.subtasks || []
      })
    } else {
      setCurrentTask({
        id: 0,
        title: '',
        description: '',
        completed: false,
        list: 'Personal',
        date: '',
        tag: '',
        subtasks: []
      })
    }
    setIsTaskPanelOpen(true)
  }

  const closeTaskPanel = () => {
    setIsTaskPanelOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentTask(prev => ({ ...prev, [name]: value }))
  }

  const addSubtask = () => {
    setCurrentTask(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { id: Date.now(), title: '', completed: false }]
    }))
  }

  const handleSubtaskChange = (id: number, value: string) => {
    setCurrentTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.map(subtask =>
        subtask.id === id ? { ...subtask, title: value } : subtask
      ) || []
    }))
  }

  const saveTask = () => {
    if (currentTask.id) {
      setTasks(prev => prev.map(task => task.id === currentTask.id ? currentTask : task))
    } else {
      setTasks(prev => [...prev, { ...currentTask, id: Date.now() }])
    }
    closeTaskPanel()
  }

  const deleteTask = () => {
    if (currentTask.id) {
      setTasks(prev => prev.filter(task => task.id !== currentTask.id))
    }
    closeTaskPanel()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {isExpanded && <h1 className="text-2xl font-bold">Unload</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200" aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}>
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {isExpanded && (
          <div className="relative px-4 mb-6">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-8 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-6 top-2.5 text-gray-400" size={18} />
          </div>
        )}
        <nav className="flex-grow overflow-y-auto">
          <div className="px-4">
            <h2 className="text-xs font-semibold text-gray-500 mb-2">{isExpanded ? 'TASKS' : ''}</h2>
            <ul className="space-y-1 mb-6">
              <li className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100">
                <div className="flex items-center">
                  <ChevronRight size={18} />
                  {isExpanded && <span className="ml-2">Upcoming</span>}
                </div>
                {isExpanded && <span className="text-gray-500 text-sm">12</span>}
              </li>
              <li className="flex items-center justify-between py-1 px-2 rounded bg-gray-200">
                <div className="flex items-center">
                  <ChevronRight size={18} />
                  {isExpanded && <span className="ml-2 font-medium">Today</span>}
                </div>
                {isExpanded && <span className="text-gray-500 text-sm">5</span>}
              </li>
              <li className="flex items-center py-1 px-2 rounded hover:bg-gray-100">
                <Calendar size={18} />
                {isExpanded && <span className="ml-2">Calendar</span>}
              </li>
              <li className="flex items-center py-1 px-2 rounded hover:bg-gray-100">
                <StickyNote size={18} />
                {isExpanded && <span className="ml-2">Sticky Wall</span>}
              </li>
            </ul>
            <h2 className="text-xs font-semibold text-gray-500 mb-2">{isExpanded ? 'LISTS' : ''}</h2>
            <ul className="space-y-1 mb-6">
              <li className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                {isExpanded && (
                  <>
                    <span className="ml-2">Personal</span>
                    <span className="text-gray-500 text-sm">3</span>
                  </>
                )}
              </li>
              <li className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                {isExpanded && (
                  <>
                    <span className="ml-2">Work</span>
                    <span className="text-gray-500 text-sm">6</span>
                  </>
                )}
              </li>
              <li className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                {isExpanded && (
                  <>
                    <span className="ml-2">List 1</span>
                    <span className="text-gray-500 text-sm">3</span>
                  </>
                )}
              </li>
              <li className="flex items-center py-1 px-2 rounded hover:bg-gray-100">
                <Plus size={18} />
                {isExpanded && <span className="ml-2">Add New List</span>}
              </li>
            </ul>
            <h2 className="text-xs font-semibold text-gray-500 mb-2">{isExpanded ? 'TAGS' : ''}</h2>
            {isExpanded ? (
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Tag 1</span>
                <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-sm">Tag 2</span>
                <span className="px-2 py-1 border border-dashed rounded text-sm">+ Add Tag</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                <Plus size={18} />
              </div>
            )}
          </div>
        </nav>
        <div className="mt-auto p-4 space-y-1">
          <button className="flex items-center w-full py-1 px-2 rounded hover:bg-gray-100">
            <Settings size={18} />
            {isExpanded && <span className="ml-2">Settings</span>}
          </button>
          <button className="flex items-center w-full py-1 px-2 rounded hover:bg-gray-100">
            <LogOut size={18} />
            {isExpanded && <span className="ml-2">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow flex overflow-hidden">
        <main className={`flex-grow p-6 overflow-y-auto transition-all duration-300 ease-in-out ${isTaskPanelOpen ? 'mr-96' : ''}`}>
          <h2 className="text-4xl font-bold mb-6">Today <span className="text-gray-400">5</span></h2>
          <button
            onClick={() => openTaskPanel()}
            className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
          >
            <Plus size={18} />
            <span className="ml-2">Add New Task</span>
          </button>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-4" checked={task.completed} onChange={() => {}} />
                  <span>{task.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {task.date && <span className="text-sm text-gray-500">{task.date}</span>}
                  {task.subtasks && <span className="text-sm text-gray-500">{task.subtasks.length} Subtasks</span>}
                  {task.tag && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">{task.tag}</span>
                  )}
                  {task.list && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">{task.list}</span>
                  )}
                  <button onClick={() => openTaskPanel(task)} aria-label="Edit task">
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>

        {/* Task Details Panel */}
        <div className={`bg-white w-96 overflow-y-auto transition-all duration-300 ease-in-out ${isTaskPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Task:</h3>
              <button onClick={closeTaskPanel} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 flex-grow">
              <input
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleInputChange}
                placeholder="Task title"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={currentTask.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded h-24"
              ></textarea>
              <div>
                <label className="block mb-1">List</label>
                <select
                  name="list"
                  value={currentTask.list}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="List 1">List 1</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Due date</label>
                <input
                  type="date"
                  name="date"
                  value={currentTask.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Tag 1</span>
                  <button className="px-2 py-1 border border-dashed rounded text-sm">+ Add Tag</button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Subtasks:</h4>
                <button onClick={addSubtask} className="flex items-center text-blue-600 hover:text-blue-800 mb-2">
                  <Plus size={18} />
                  <span className="ml-1">Add New Subtask</span>
                </button>
                <ul className="space-y-2">
                  {currentTask.subtasks?.map((subtask) => (
                    <li key={subtask.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => {}}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                        placeholder="Subtask"
                        className="w-full p-2 border rounded"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={deleteTask} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete Task
              </button>
              <button onClick={saveTask} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}