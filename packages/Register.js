/**
 * @module Needle
 * @method registerInjector
 * @param label {String}
 * @param klass {Object,String}
 * Responsible for registering an injector.
 * @return {void}
 */
Needle.prototype.registerInjector = function registerInjector(label, klass) {

    this._injectors[label] = klass;

};

/**
 * @module Needle
 * @method getInjectors
 * Returns a list of all registered injectors.
 * @return {Object}
 */
Needle.prototype.getInjectors = function getInjectors() {

    return this._injectors;

};