(function ($) {

Drupal.behaviors.meedan_notifications_menu_visibility = {
  attach: function (context, settings) {
    var block = $('#block-views-my-notifications-block', context);
    var title = block.find('h2');
    block.find('.content').hide();
    title.unbind('click');
    title.click(function() {
      var that = $(this);
      if (block.hasClass('notifications-block-expanded')) {
        block.find('.content').slideUp('slow', function() {
          block.removeClass('notifications-block-expanded');
        });
      } else {
        block.addClass('notifications-block-expanded');
        block.find('.content').slideDown('slow');
      }
      that.find('.notifications-label').html(Drupal.t('Notifications'));
      if (that.find('.notifications-count').html() != '') {
        $.ajax({
          type: 'GET',
          url: Drupal.settings.basePath + 'user/update-last-time',
          success: function(data) {
            if (data.timestamp) that.find('.notifications-count').html('');
          }
        });
      }
    });
    $('html').click(function() {
      block.find('.content').slideUp('slow', function() {
        block.removeClass('notifications-block-expanded');
      });
    });
    block.click(function(event){
      event.stopPropagation();
    });
  }
};

Drupal.behaviors.meedan_notifications_load_more = {
  attach: function (context, settings) {
    var block = $('#block-views-my-notifications-block', context);
    var container =  block.find('.view-content');
    container.unbind('scroll');
    container.on('scroll', function() {
      if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).outerHeight()) {
        block.find('.pager a').click();
      }
    });
  }
};

Drupal.behaviors.alert_new_notifications = {
  attach: function (context, settings) {
    var block = $('#block-views-my-notifications-block');
    block.unbind('autorefresh.update');
    block.bind('autorefresh.update', function(e, nid) {
      Drupal.behaviors.meedan_notifications_load_more.attach();
    });
    block.unbind('autorefresh.ping');
    block.bind('autorefresh.ping', function(e, count) {
      var counter = $(this).find('.notifications-count');
      var title = $(this).find('.notifications-label');
      if (counter.html() == '') {
        counter.html('<span>' + count + '</span>');
        if (parseInt(count) == 1) title.html(Drupal.t('Notification'));
        else title.html(Drupal.t('Notifications'));
      }
      else {
        counter.html('<span>' + (parseInt(counter.find('span').html()) + parseInt(count)) + '</span>');
        title.html(Drupal.t('Notifications'));
      }
    });
  }
};

})(jQuery);