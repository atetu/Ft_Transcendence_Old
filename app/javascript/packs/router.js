import Backbone from "backbone";

const Router = Backbone.Router.extend({
  routes: {
    "": "home",
    channels: "channels",
    "channel/:channel_id": "channelById",
  },
  home() {
    console.log("home()");
    //console.trace();
  },
  channels() {
    console.log("channels()");
    //console.trace();
  },
  channelById(channel_id) {
    console.log("channelById(" + channel_id + ")");
    //console.trace();
  },
});

const router = new Router();
router.on("route", function (currentRoute, params) {
  //console.trace([currentRoute, params]);
  //Navbar.currentRoute.set({ route: curRoute });
});

export default router;
