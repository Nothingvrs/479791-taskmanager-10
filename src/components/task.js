import {MONTH_NAMES} from '../const.js';
import {createElement, formatTime} from '../utils.js';


const createHashtagsMarkup = (hashtags) => {
  return hashtags
    .map((hashtag) => {
      return (
        `<span class="card__hashtag-inner">
            <span class="card__hashtag-name">
              #${hashtag}
            </span>
          </span>`
      );
    })
    .join(`\n`);
};

export default class Task {
  constructor(task, list, form) {
    this._task = task;
    this._list = list;
    this._form = form;
    this._element = null;
  }

  getTemplate() {
    const {description, tags, dueDate, color, repeatingDays} = this._task;

    const isExpired = dueDate instanceof Date && dueDate < Date.now();
    const isDateShowing = !!dueDate;

    const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
    const time = isDateShowing ? formatTime(dueDate) : ``;

    const hashtags = createHashtagsMarkup(Array.from(tags));
    const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;

    return (
      `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites card__btn--disabled"
            >
              favorites
            </button>
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtags}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  replaceEditToTask(task, taskEdit) {
    this._list.replaceChild(task.getElement(), taskEdit.getElement());
  }

  replaceTaskToEdit(task, taskEdit) {
    this._list.replaceChild(taskEdit.getElement(), task.getElement());
  }

  getTaskEdit(button, task, taskEdit, handler) {
    button.addEventListener(`click`, () => {
      this.replaceTaskToEdit(task, taskEdit);
      document.addEventListener(`keydown`, handler);
    });
  }

  taskEditAccess(task, taskEdit, handler) {
    this._form.addEventListener(`submit`, () => {
      this.replaceEditToTask(task, taskEdit);
      document.removeEventListener(`keydown`, handler);
    });
  }
}

