import {createElement} from '../utils.js';

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((it, i) => this.createFilterMarkup(it, i === 0)).join(`\n`);

    return (
      `<section class="main__filter filter container">
    ${filtersMarkup}
  </section>`
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

  createFilterMarkup(filter, isChecked) {
    const {name, count} = filter;

    return (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span>
      </label>`
    );
  }


}
