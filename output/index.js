"use strict";

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _readline = require("readline");

var _fs = require("fs");

var _path = require("path");

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var csvFilePath = (0, _path.join)(__dirname, '../Module1/files/nodejs-hw1-ex1.csv');

var convertIntoJSON = () => {
  return new Promise((resolve, reject) => {
    (0, _csvtojson.default)({
      ignoreEmpty: true,
      downstreamFormat: 'line'
    }).fromFile(csvFilePath).then(jsonObj => {
      (0, _fs.writeFile)((0, _path.join)(__dirname, './JSONFile.json'), JSON.stringify(jsonObj), err => {
        if (err) {
          reject(403);
        }

        resolve(200);
      });
    }).catch(() => {
      reject(403);
    });
  });
};

var writeToTextFile = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    try {
      var response = yield convertIntoJSON();

      if (response === 200) {
        var fileStream = (0, _fs.createReadStream)((0, _path.join)(__dirname, './JSONFile.json'));
        var readFile = (0, _readline.createInterface)({
          input: fileStream,
          crlfDelay: Infinity
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;

        var _iteratorError;

        try {
          for (var _iterator = _asyncIterator(readFile), _step, _value; _step = yield _iterator.next(), _iteratorNormalCompletion = _step.done, _value = yield _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
            var line = _value;
            var readData = JSON.parse(line);

            for (var data of readData) {
              console.log(JSON.stringify(data));
              (0, _fs.appendFile)((0, _path.join)(__dirname, './OutputText.txt'), JSON.stringify(data) + _os.EOL, err => {
                if (err) {
                  console.log(err);
                }
              });
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              yield _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    } catch (error) {
      console.log('Error', error);
    }
  });

  return function writeToTextFile() {
    return _ref.apply(this, arguments);
  };
}();

var main = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* () {
    yield writeToTextFile();
  });

  return function main() {
    return _ref2.apply(this, arguments);
  };
}();

main();