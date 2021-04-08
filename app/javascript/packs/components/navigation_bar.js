const NavigationBarModel = Backbone.Model.extend({
  default: {
    active: null,
  },
});

const NavigationBarLinkModel = Backbone.Model.extend({
  default: {
    route: null,
    name: null,
  },
});

const NavigationBarLinkCollection = Backbone.Collection.extend({
  model: NavigationBarLinkModel,
});

const NavigationBarView = Backbone.View.extend({
  el: "#navigation-bar",
  template: _.template($("script[id='template-navigation-bar-items']").html()),
  initialize(options) {
    this.model = new NavigationBarModel();
    this.links = new NavigationBarLinkCollection();

    _.bindAll(this, "render", "setActive");

    this.links.add(
      new NavigationBarLinkModel({
        route: "channels",
        name: "channels",
      })
    );
    this.links.add(
      new NavigationBarLinkModel({
        route: "guilds",
        name: "guilds",
      })
    );
    
    this.links.add(
      new NavigationBarLinkModel({
        route: "games",
        name: "games",
      })
    );

    this.model.on("change", this.render);
    this.links.bind("change", this.render);
  },
  render() {
    this.$("#navigation-bar-links").html(
      this.template({
        active: this.model.get("active"),
        links: this.links.toJSON(),
      })
    );

    return this;
  },
  setActive(route) {
    this.model.set("active", route);
  },
});

export { NavigationBarView };
