import { Actions } from '../jotastic-functions.js';

export const executeActions = function (actionElements, props) {
    actionElements
        .forEach(actionElement => {
            const action = Actions[actionElement[0]].action;
            actionElement[1].forEach(element => action(element, props))
        });
};
