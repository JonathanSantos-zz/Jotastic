import { isNullOrUndefined } from './utils.JS';


class Jotastic {

    constructor ({el, state, method}, parent = document) {
        this.el = this._parseEl(el, parent);
        this.state = state;
        this.method = method;

        this._mappedBinds = this._mappingBinds(this.el, this.state);
        this._binding(this._mappedBinds, this.state);
    }

    _parseEl (el, parent) {
        if (typeof el === 'string') {
            el = parent.querySelector(el);
        }

        return el;
    }

    //Melhorar mapeamento, pois cada bind está ficando com um array novo de nodeValue.
    _mappingBinds (element, state) {
        let id = 1;
        const mappingNode = {};

        const mappedTextNodes = [...element.querySelectorAll('*')]
            .map(element => {
                const childNodes = element.childNodes || [];
                const textNodes = [];

                for (let i = 0; i < childNodes.length; i++) {
                    const childNode = childNodes[i];

                    if (childNode.nodeType == Node.TEXT_NODE) {
                        textNodes.push(childNode);
                    }
                }

                if (textNodes.length === 0) {
                    return null;
                }

                return { elementHtml: element, textNodes };
            }).filter(element => element !== null);

        const mappedBind = mappedTextNodes.map(element => {
            const { elementHtml, textNodes } = element;
            const mapped = [];

            for (let i = 0; i < textNodes.length; i++) {
                const textNode = textNodes[i];
                const nodeValue = textNode.nodeValue.split(/(\{\{[^}]+\}\})/g).filter(x => x !== '');
                const splitedTextNode = nodeValue;
                const mappedBinds = splitedTextNode.map((node, index) => node.match(/^\{\{[^}]+\}\}$/) ? { prop: node.replace(/^\{\{([^}]+)\}\}$/, '$1').trim(), index } : null).filter(x => x !== null);
                
                if (mappedBinds.length > 0) {
                    mapped.push({ id, mapped: mappedBinds });
                    mappingNode[id] = { textNode, nodeValue };
                    id++;
                }
            }

            return { elementHtml, mapped };

        }).filter(mapped => mapped.mapped.length > 0);

        const stateMapping = {};
        mappedBind.forEach(({ mapped }) => {
            mapped.forEach(m => {
                const { mapped, id } = m;

                mapped.forEach(map => {
                    const { prop, index } = map;

                    if (stateMapping[prop] === undefined) {
                        stateMapping[prop] = [];
                    }
    
                    stateMapping[prop].push({
                        index,
                        id
                    });

                });
            });
        });

        return { stateMapping, nodeMapping: mappingNode };
    }

    _setState (state) {
        this._binding(this._mappedBinds, state, this.methods);
    }

    _binding ({ stateMapping, nodeMapping }, state, method = this.method) {
        Object
            .keys(stateMapping)
            .forEach(key => {
                let value = state[key];

                if (isNullOrUndefined(value)) {
                    return;
                }
                
                if (value instanceof Function) {
                    value = value.bind(state, {...state, ...method})();
                }

                const stateMapped = stateMapping[key];
                for (let i = 0; i < stateMapped.length; i++) {
                    const { id, index } = stateMapped[i];
                    const { textNode, nodeValue } = nodeMapping[id];

                    this._setTextNode({ textNode, nodeValue, index, value });
                }
            });
    }

    _setTextNode ({ textNode, nodeValue, index, value }) {
        nodeValue[index] = value;
        const val = nodeValue.join('');
        textNode.nodeValue = val;
    }

    setState (state) {
        this.state = Object.assign(this.state, state);
        this._setState(state);
    }

}

export { Jotastic };
