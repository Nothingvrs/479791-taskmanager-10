import {createSiteMenuTemplate} from './components/menu.js';
import {createSortingTemplate} from './components/sorting';
import {createFilterTemplate} from './components/filter.js';
import {createTaskTemplate} from './components/task.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {createBoardTemplate} from './components/board.js';

const TASK_AMOUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const taskBoardElement = siteMainElement.querySelector(`.board`);
render(taskBoardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate());

new Array(TASK_AMOUNT)
  .fill(``)
  .forEach(
      () => render(taskListElement, createTaskTemplate())
  );

render(taskBoardElement, createLoadMoreButtonTemplate());
