class Walidator {
    static isBlank = (value) => {
        return !value || value.trim().length === 0
    }

}

export default Walidator