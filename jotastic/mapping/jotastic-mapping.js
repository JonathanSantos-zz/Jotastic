const formatter = (arr) =>
    arr.filter(arr => arr[1].length > 0);
    //    .reduce((obj, item) => {
    //        obj[item[0]] = item[1];
    //        return obj;
    //    }, {});

export const MappedComponents = function (elements, components) {
    // console.log('MappedComponents', ...arguments);
    return formatter(components.map(component => [component, [...elements.querySelectorAll(component)]]));
};

export const MappedData = function (elements, data) {
    // console.log('MappedData', ...arguments);
    return formatter(data.map(d => [d, [...elements.querySelectorAll(`*[${d}]`)]]));
};

export const MappedActions = function (elements, actions) {
    // console.log('MappedActions', ...arguments);
    return formatter(
        actions.map(d => {
            const mappedActions = [...elements.querySelectorAll(`*[${d}]`)];
            // [d, mappedActions, !values] // Ajustar
        })
    );
};