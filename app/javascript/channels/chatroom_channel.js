import consumer from "./consumer";

$(document).on("turbolinks:load", function () {
  $("#new_message").on("ajax:success", function (a, b, c) {
    $(this).find('input[type="text"]').val("");
  });

  $('[data-channel-subscribe="chatroom"]').each(function (index, element) {
    var $element = $(element),
      chatroom_id = $element.data("chatroom-id"),
      messageTemplate = $('[data-role="message-template"]');

    $element.animate({ scrollTop: $element.prop("scrollHeight") }, 1000);

    consumer.subscriptions.create(
      {
        channel: "ChatroomChannel",
        chatroom: chatroom_id,
      },
      {
        received: function (data) {
          var content = messageTemplate.children().clone(true, true);
          content
            .find('[data-role="user-avatar"]')
            .attr("src", data.user_avatar_url);
          content.find('[data-role="message-text"]').text(data.content);
          content.find('[data-role="message-date"]').text(data.updated_at);
          $element.append(content);
          $element.animate({ scrollTop: $element.prop("scrollHeight") }, 1000);
        },
      }
    );
  });
});
