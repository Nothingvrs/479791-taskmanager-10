import AbstractComponent from './abstract-component.js';

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filtersMarkup = this._filters.map((it, i) => this.createFilterMarkup(it, i === 0)).join(`\n`);

    return (
      `<section class="main__filter filter container">
         ${filtersMarkup}
      </section>`
    );
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
