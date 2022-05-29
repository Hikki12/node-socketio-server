class Variables {
    /**
     * Creates an inteligent variables manager (JSON).
     * @param {object} variables - a json with variables names and values.
     */
    constructor(variables={}){
        this.variables = variables;
        this.backup = {...variables};
        this.updatedStatus = false;
    }

    toString(){
        return this.variables;
    }

    /**
     * Restores the variables values using the backup.
     */
    restore(){
        this.variables = {...this.backup};
    }

    /** 
     * Returns the variables values.
    */
    values(){
        return this.variables;
    }

    /**
     * Updates a specific variable value
     * @param {string} key - the variable name
     * @param {*} value - a value for the current variable
     * @param {boolean} backup - save the previous variables values?
     */
    set = (key, value, backup = true) => {
        if(backup){
            this.backup = {...this.variables};
        }
        this.variables[key] = value;
    }
    
    /**
     * Returns a value of the variables JSON given a key
     * @param {string} key - the current variable name
     */
    get = (key) => {
        return this.variable[key];
    }

    /**
     * Updates the updated status.
     * @param {boolean} value.
     */
    setUpdated = (value) => {
        this.updatedStatus = value;
    }

    /** 
     * Updates variables values.
     * @param {string} data - a json string with variables.
    */
    update = (data) => {
        let variables = data;
        if (typeof variables === 'string'){
            variables = JSON.parse(variables);
        }
        this.variables = {...variables};
        this.backup = {...variables};
        this.setUpdated(true);
    }

    /** 
     * Returns the updated status value
     * @returns {boolean} - updated status
    */
    updated = () =>{
        return this.updatedStatus;
    }
}

class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(event, data){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}


class ReusableTimer {
    constructor(cb, delay){
        this.cb = cb;
        this.delay = delay;
        this.timer = null;
    }

    start(){
        this.stop();
        this.timer = setTimeout(this.cb, this.delay);
    }

    stop(){
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
