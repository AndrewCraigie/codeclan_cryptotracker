

const element = {

}

element.prototype.make = function(definition){

  const element = document.createElement(definition.tag);
  const attribs = definition.attribs;
  for (let attrib in definition.attribs){
    if (attribs.hasOwnProperty(attrib)) {
      element.setAttribute(attrib, attribs[attrib])
    }
  }

  return element;

};

module.exports = element;
