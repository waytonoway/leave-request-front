import _ from "lodash";

export const mapForm = (data) => {
    return _.mapKeys(data, (value, key) => _.snakeCase(key));
}

export const mapEntity = (entity: Object) => {
    return Object.keys(entity).reduce((acc, key) => {
        const newKey = _.camelCase(key);

        let value = entity[key];
        if (typeof value === 'object') {
            value = mapEntity(value);
        }

        acc[newKey] = value;

        return acc;
    }, {});
}

export const mapToQuery = (object) => {
    const snakeCaseObject = _.mapKeys(object, (value, key) => _.snakeCase(key));

    return new URLSearchParams(snakeCaseObject).toString();
}
