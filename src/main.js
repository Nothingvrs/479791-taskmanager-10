import BoardController from './controllers/board.js';
import Board from './components/board.js';
import Filter from './components/filter.js';
import SiteMenu from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './components/utils/render.js';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenu(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new Filter(filters), RenderPosition.BEFOREEND);

const boardComponent = new Board();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);

const boardController = new BoardController(boardComponent);

boardController.render(tasks);
