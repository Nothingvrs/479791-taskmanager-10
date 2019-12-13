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
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortedTasks = [];
    this._taskListElement = this._tasksComponent.getElement();
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

    renderTasks(this._taskListElement, tasks.slice(0, this._showingTasksCount));
    this.renderLoadMoreButton(tasks);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this.sortTasks(tasks, sortType);
    });
  }

  renderLoadMoreButton(tasks) {
    const container = this._container.getElement();
    if (this._showingTasksCount >= tasks.length) {
      return;
    }

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      renderTasks(this._taskListElement, tasks.slice(prevTasksCount, this._showingTasksCount));

      if (this._showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  sortTasks(tasks, sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        this._sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        this._sortedTasks = tasks.slice(0, this._showingTasksCount);
        break;
    }

    this._taskListElement.innerHTML = ``;

    renderTasks(this._taskListElement, this._sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this.renderLoadMoreButton(tasks, this._showingTasksCount, this._taskListElement);
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
