$("#tabs li").each(function(index) {
  var tab = $(this);
  tab.click(function() {
    old_tab = $("#tabs li.selected");
    old_tab.removeClass("selected");
    tab.addClass("selected");

    $("#content #" + old_tab.prop("id")).addClass("hidden");
    $("#content #" + tab.prop("id")).removeClass("hidden");
  });
});
