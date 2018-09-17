const JotasticFunctions = {};

JotasticFunctions.actions = {};
JotasticFunctions.add = function (actionName, action) {
    JotasticFunctions.actions[actionName] = { actionName, action };
};

JotasticFunctions.add('j-if', function (element, property, props) {
    console.log("jotastic['j-if']", ...arguments);
});

JotasticFunctions.add('j-for', function () {
    console.log("jotastic['j-for]", ...arguments);
});

const Actions = JotasticFunctions.actions;

export { JotasticFunctions, Actions };
