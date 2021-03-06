/**
 * @module Needle
 * @method new
 * @param klass {Object,String}
 * @param constructorArgs {Array}
 * Responsible for instantiating a new object, injecting any required dependencies.
 * @return {Object}
 */
Needle.prototype.new = function instantiate(klass, constructorArgs) {

    // Transform the function's definition into a string so that we can parse its dependencies.
    var functionDefinition      = klass.toString().trim();

    // Find the section of the defined function where the arguments are specified.
    var declarationExtractor    = new RegExp('^function [^{]+', 'ig'),
        declaration             = functionDefinition.match(declarationExtractor)[0].trim();

    // Find the dependencies from the function's arguments.
    var extractor       = new RegExp('(\\$[a-z0-9_]+)', 'ig'),
        dependencies    = declaration.match(extractor),
        dependencyArgs  = [];

    // Iterate over each defined dependency.
    for (var dependency in dependencies) {

        if (!dependencies.hasOwnProperty(dependency)) {
            // The usual suspect...
            continue;
        }

        // Find the name from the dependency, and then locate the relevant injector.
        var name        = dependencies[dependency].replace(/\$/, ''),
            injector    = this._injectors[name];

        // Perform a check to ensure that the injector has been registered.
        if (typeof injector === 'undefined') {
            console.error('NEEDLE.JS - Invalid dependency: ' + name);
            continue;
        }

        // Otherwise we have the injector, so we can append it to the eventual arguments.
        dependencyArgs.push(injector);

    }

    // Now that we have the dependencies for the class, we can instantiate the object
    // passing in the arguments where necessary.
    var instance = klass.apply(null, dependencyArgs);

    if (klass.prototype) {
        // If we have a `prototype` property attached to the function, then we'll need to mimic
        // the behaviour of JavaScript's `new` construct and apply the `__proto__` ourselves.
        instance.__proto__ = klass.prototype;
    }

    if (typeof instance.constructor === 'function') {

        if (!Array.isArray(constructorArgs)) {
            // If the constructor's arguments aren't an actual array, then we'll
            // need to convert the arguments into a valid array.
            constructorArgs = Array.prototype.slice.call(arguments, 1);
        }

        // Invoke the function's `constructor` method if it exists.
        instance.constructor.apply(instance, constructorArgs);

    }

    return instance;

};