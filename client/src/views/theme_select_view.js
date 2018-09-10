const PubSub = require('../helpers/pub_sub.js');
const element = require('../helpers/element.js');

const ThemeSelectView = function(container, defaultTheme){
  this.container = container;
  this.selectedTheme = defaultTheme;
  this.themeNames = [];
  this.theme = null;
};

//'Themes:theme-list'
ThemeSelectView.prototype.bindEvents = function(){

  PubSub.subscribe('Themes:theme-list', (event) => {
    this.themeNames = event.detail[0];
    this.selectedTheme = event.detail[1];
    this.render();
  })
};

ThemeSelectView.prototype.handleSelect = function(event){

  this.selectedTheme = event.target.value;
  PubSub.publish('ThemeSelectView:theme-selected', this.selectedTheme)

};

ThemeSelectView.prototype.render = function(){

  const themeSelect = element.make({
    tag: 'select',
    attribs: {
      id: 'theme-select',
      value: this.selectedTheme
    }
  });
  themeSelect.addEventListener('change', this.handleSelect.bind(this));

  this.themeNames.forEach( (name) => {
    let themeOption = element.make({
      tag: 'option',
      attribs: {
        value: name,
      },
      content: name
    });

    if (this.selectedTheme === name){
      themeOption.selected = true;
    }

    themeSelect.appendChild(themeOption);
  });

  this.container.appendChild(themeSelect);

};

module.exports = ThemeSelectView;
