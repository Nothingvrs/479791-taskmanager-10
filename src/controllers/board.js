import LoadMoreButton from '../components/load-more-button.js';
import TaskEdit from '../components/task-edit.js';
import Task from '../components/task.js';
import Tasks from '../components/tasks.js';
import Sort, {SortType} from '../components/sort.js';
import NoTasks from '../components/no-tasks.js';
import {render, remove, replace, RenderPosition} from '../components/utils/render.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const taskComponent = new Task(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEdit(task);

  taskEditComponent.setSubmitHandler(replaceEditToTask);

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new Sort();
    this._tasksComponent = new Tasks();
    this._loadMoreButtonComponent = new LoadMoreButton();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    let sortedTasks = [];

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    this.renderLoadMoreButton(tasks, showingTasksCount, taskListElement);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this.sortTasks(tasks, showingTasksCount, sortType, sortedTasks, taskListElement);
    });
  }

  renderLoadMoreButton(tasks, showingTasksCount, taskListElement) {
    const container = this._container.getElement();
    if (showingTasksCount >= tasks.length) {
      return;
    }

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  sortTasks(tasks, showingTasksCount, sortType, sortedTasks, taskListElement) {
    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks.slice(0, showingTasksCount);
        break;
    }

    taskListElement.innerHTML = ``;

    renderTasks(taskListElement, sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this.renderLoadMoreButton(tasks, showingTasksCount, taskListElement);
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
