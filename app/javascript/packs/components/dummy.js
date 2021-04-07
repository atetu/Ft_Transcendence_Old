const EmptyView = Backbone.View.extend({
  template: _.template($("script[id='template-empty']").html()),
  render() {
    this.$el.html(this.template());

    return this;
  },
});

export { EmptyView };
