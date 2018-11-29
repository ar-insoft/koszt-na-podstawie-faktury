import _ from 'lodash'

class Walidator {
    static isBlank = (value) => {
        return _.isNil(value) || _.isNaN(value) || (!_.isNumber(value) && value.trim().length === 0)
    }
    static isNotBlank = (value) => {
        return !_.isNil(value) && !_.isNaN(value) && (_.isNumber(value) || value.trim().length > 0)
    }
}

export default Walidator