import _ from "underscore";

console.log(_.prototype)
_.templateSettings.escape = /<%e([\s\S]+?)%>/g;