
const element = {

}

element.make = function(definition){

  const element = document.createElement(definition.tag);
  const attribs = definition.attribs;
  for (let attrib in definition.attribs){
    if (attribs.hasOwnProperty(attrib)) {
      element.setAttribute(attrib, attribs[attrib])
    }
  }
  if (definition.hasOwnProperty('content')) {
    element.textContent = definition.content
  }

  return element;

};

module.exports = element;
