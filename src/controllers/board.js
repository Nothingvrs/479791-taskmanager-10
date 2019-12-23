import SortComponent, {SortType} from "../components/sort";
import Tasks from "../components/tasks";
import LoadMoreButton from "../components/load-more-button";
import NoTasks from "../components/no-tasks";

import TaskController from './task';
import {take} from "../components/utils/common";
import {render} from "../components/utils/render";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
  });
};

const sortByDateInAscendingOrder = (a, b) => a.dueDate - b.dueDate;

const sortByDateInDescendingOrder = (a, b) => b.dueDate - a.dueDate;

const sortPurely = (collection, iterate) => collection.slice().sort(iterate);

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._taskListComponent = new Tasks();
    this._noTasksMessageComponent = new NoTasks();
    this._loadMoreButtonComponent = new LoadMoreButton();
  }

  render(tasks) {
    const renderLoadMoreButton = (arrayTask) => {
      if (showingTasksCount >= arrayTask.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        renderTasks(taskListElement, take(arrayTask, SHOWING_TASKS_COUNT_BY_BUTTON, showingTasksCount));

        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

        if (showingTasksCount > arrayTask.length) {
          this._loadMoreButtonComponent.removeElement();
        }
      });

    };

    const container = this._container.getElement();

    const inDoingTasks = tasks.filter((task) => !task.isArchive);

    if (inDoingTasks.length === 0) {
      render(container, this._noTasksMessageComponent);
      return;
    }

    const taskListElement = this._taskListComponent.getElement();

    render(container, this._sortComponent);

    render(container, this._taskListComponent);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, take(inDoingTasks, showingTasksCount));
    renderLoadMoreButton(inDoingTasks);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP: {
          sortedTasks = sortPurely(inDoingTasks, sortByDateInAscendingOrder);
          break;
        }
        case SortType.DATE_DOWN: {
          sortedTasks = sortPurely(inDoingTasks, sortByDateInDescendingOrder);
          break;
        }
        case SortType.DEFAULT:
        default: {
          sortedTasks = inDoingTasks;
          break;
        }
      }

      showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

      taskListElement.innerHTML = ``;
      renderTasks(taskListElement, take(sortedTasks, showingTasksCount));

      renderLoadMoreButton(sortedTasks);
    });
  }
}
