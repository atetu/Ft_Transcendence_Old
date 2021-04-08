const EmptyView = Backbone.View.extend({
  template: _.template($("script[id='template-empty']").html()),
  render() {
    this.$el.html(this.template());

    return this;
  },
});

const SimpleView = Backbone.View.extend({
  initialize(options) {
    this.template = _.template($(options.template).html());
    this.data = options.data;
  },
  render() {
    this.$el.html(this.template(this.data));

    return this;
  },
});

export { EmptyView, SimpleView };
