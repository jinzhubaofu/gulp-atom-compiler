/**
 * @file gule atom compiler
 * @author leon<ludafa@outlook.com>
 */

const through = require('through2');
const compiler = require('vip-server-renderer');
const path = require('path');

module.exports = function (options) {

    return through.obj(function (file, encoding, callback) {

        try {

            if (file.isStream()) {
                throw new Error('gulp-atom-compiler not support stream');
            }

            let content = file.isBuffer()
                ? file.contents.toString(encoding)
                : file.contents;

            let result = compiler.compile(
                Object.assign({}, options, {content: content})
            );

            let {js, php, css} = result.compiled;
            let extname = path.extname(file.path);
            let basename = path.basename(file.path, extname);
            let dirname = path.dirname(file.path);

            file.path = path.join(dirname, `${basename}${extname}.php`);
            file.contents = Buffer.from(php);

            callback(null, file);

        }
        catch (e) {
            console.log(e);
            callback(e);
        }
    });

};
