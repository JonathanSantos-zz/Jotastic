import { Actions } from './jotastic-functions.js';
import { MappedComponents, MappedData, MappedActions } from './mapping/jotastic-mapping.js';
import { executeActions } from './binding/jotastic-actions.js';

class Jotastic {

    constructor ( props, parent = document ) {
        const { el, mapComponents, mapData, mapAction, data } = this.parseJostatic(props, parent);
        const [ mappedComponents, mappedData, mappedActions ] = [ MappedComponents(el, mapComponents), MappedData(el, mapData), MappedActions(el, mapAction) ];

        executeActions(mappedActions, data());
        console.log(mappedComponents, mappedData, mappedActions);
    }

    parseJostatic ({ el, data, html, jotastic }, parent) {
        if (html && typeof html === 'string') {
            el = document.createElement('template');
            el.innerHTML = html;
        } else if (el && typeof el === 'string') {
            el = parent.querySelector(el);
            html = el.innerHTML;
        }

        const mapComponents = Object.keys(this.components);
        const mapData = Object.keys(data());
        const mapAction = Object.keys(Actions);

        return { el, data, html, mapComponents, mapData, mapAction };
    }

    get components () {
        return Jotastic.components;
    }

}

Jotastic.components = {};

Jotastic.add = function (componentName, props, parent = document) {
    Jotastic.components[componentName] = { componentName, props, parent };
};

export { Jotastic };