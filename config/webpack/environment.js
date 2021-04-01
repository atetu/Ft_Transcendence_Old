const { environment } = require("@rails/webpacker");
const webpack = require("webpack");

environment.plugins.prepend(
  "Provide",
  new webpack.ProvidePlugin({
    $: "jquery",
    _: "underscore",
    jQuery: "jquery",
    jquery: "jquery",
    underscore: "underscore",
    "window.jQuery": "jquery",
    "window.underscore": "underscore",
    Popper: ["popper.js", "default"],
  })
);

/*environment.plugins.prepend(
    "Provide",
    new webpack.ProvidePlugin({
        $: "jquery",
        _: "underscore",
        jQuery: "jquery",
        jquery: "jquery",
        underscore: "underscore",
        "window.jQuery": "jquery",
        "window.underscore": "underscore",
        Popper: ["popper.js", "default"],
    })
);*/

module.exports = environment;
