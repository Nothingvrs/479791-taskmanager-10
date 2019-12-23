import TaskComponent from "../components/task";
import InEditTaskComponent from "../components/task-edit";

import {render, replace} from "../components/utils/render";

export default class TaskController {
  constructor(container) {
    this._container = container;
  }

  render(task) {
    const taskComponent = new TaskComponent(task);
    const taskEditComponent = new InEditTaskComponent(task);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        startTaskEditing();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const startTaskEditing = () => replace(taskComponent, taskEditComponent);

    const stopTaskEditing = () => replace(taskEditComponent, taskComponent);

    taskComponent.setEditButtonClickHandler(() => {
      stopTaskEditing();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setSubmitHandler(startTaskEditing);

    render(this._container, taskComponent);
  }
}
