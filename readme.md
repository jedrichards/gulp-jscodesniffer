# gulp-jscodesniffer

Gulp plugin for the [jscodesniffer](https://github.com/dsheiko/jscodesniffer) project.

From the `jscodesniffer` docs:

> JSCodeSniffer is a node.js application that checks JavaScript code style consistency according to a provided coding style, just like phpcs. One can define a custom coding style by using described below JSON notation or use one of predefined standards.

## Options

### **`standard`**

`Optional | Default:EmptyString`

A string defining a pre-made jscodesniffer coding standard. As of writing this only two pre-made standards exist, `Idiomatic` or `Jquery`. You can read more about them at the [jscodesniffer](https://github.com/dsheiko/jscodesniffer) repo.

### **`rc`**

`Optional | Default:EmptyObj`

Path to a jscodesniffer JSON configuration file. Without a defined `standard` this can be used on its own as the only source of rules. When used together with a `standard` your `rc` rules will take precedent. Here's our example [.jscsrc](https://github.com/jedrichards/gulp-jscodesniffer/blob/master/.jscsrc). Note that if you define neither a `standard` nor a `rc` then no style checking will occur.

### **`reporters`**

`Optional | Default:['default']`

An array of reporters used to process jscodesniffer output. There are three supplied reporters, which are detailed below. To use a supplied reporter add its name to the `reporters` array. You can add your own custom reporter by adding it to the array as a function (have a look at the [supplied reporters](https://github.com/jedrichards/gulp-jscodesniffer/tree/master/reporters) for help).

#### `default`

Prints out pleasantly formatted information about failures to the console.

#### `beep`

Rings your terminal bell if any failures occurred.

#### `failer`

By default this Gulp plugin will not fail its task if it encounters style breaches. Add this reporter to emit an error into the stream , fail the task and cause Gulp to exit with a `0`.

## Usage



```javascript
var gulp = require('gulp');
var jscs = require('gulp-jscodesniffer');

gulp.task('jscs',function () {
    return gulp.src('src/**/*.js')
        .pipe(jscs({
            rc: '.jscsrc',
            standard: 'Idiomatic',
            reporters: ['default','beep']
        }));
});
```
