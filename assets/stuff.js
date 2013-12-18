// Generated by CoffeeScript 1.6.3
var markSelected, resetAll, setGrid, setNumber;

$(function() {
  return setGrid();
});

$.getJSON('emojis.json', function(emojis, s) {
  return $.each(emojis, function(name, keywords) {
    var emoji;
    emoji = ':' + name + ':';
    return $('.emojis').append("<div class='emoji' data-keywords='" + keywords + "'><img alt='" + emoji + "' title='" + emoji + "' src='/emojis/" + name + ".png'>" + emoji + "</div>");
  });
});

$(document).on('focus', '[autocomplete="emojis"]', function() {
  var dropdown, input;
  $(document).off('click', '.emoji');
  $('.emoji').show();
  dropdown = $('.emojis');
  dropdown.css('top', $(this).offset().top + $(this).outerHeight() + 'px');
  dropdown.css('left', $(this).offset().left);
  input = $(this);
  $(document).on('click', '.emoji', function() {
    input.val($(this).find('img').attr('alt'));
    input.trigger('change');
    return dropdown.hide();
  });
  return dropdown.show();
});

$(document).on('keyup change', '#selection-color, #selection-opacity', function() {
  return $('style').html(".cell.selected { background-color: rgba(" + ($('#selection-color').val()) + ", " + ($('#selection-opacity').val()) + "); }");
});

$(document).on('keyup', '[autocomplete="emojis"]', function() {
  var regexp;
  regexp = new RegExp($(this).val());
  return $('.emoji').map(function(_, e) {
    var alt;
    alt = "" + ($(e).find('img').attr('alt')) + " " + ($(e).data('keywords'));
    if (!alt.match(regexp)) {
      return $(e).hide();
    } else {
      return $(e).show();
    }
  });
});

$(document).on('click', '#reset', function() {
  return $('.cell.selected').removeClass('selected');
});

$(document).on('change', '#target_emoji', function() {
  var img;
  img = $("img[title='" + ($(this).val()) + "']");
  window.target_emoji = $(this).val();
  return $('.canvas').css('background-image', "url(" + (img.attr('src')) + ")");
});

$(function() {});

$(document).on('change', '#target_emoji_from_file', function() {
  var reader;
  reader = new FileReader();
  reader.onload = function(e) {
    return $('.canvas').css('background-image', "url(" + e.target.result + ")");
  };
  return reader.readAsDataURL(this.files[0]);
});

$(document).on('mousedown', '.cell', function(e) {
  markSelected($(e.target));
  return $(document).on('mouseover', '.cell', function(e) {
    return markSelected($(e.target));
  });
});

$(document).on('mouseup', '.cell', function(e) {
  return $(document).off('mouseover', '.cell');
});

$(document).on('click', '#set-number', function() {
  if ($('.cell.selected').length === 0) {
    return false;
  }
  return setNumber();
});

$(document).on('click', '#set-grid', function() {
  return setGrid();
});

$(document).on('click', '#output', function() {
  var as_emojis, as_hubot_script, cols, emojis, output,
    _this = this;
  as_hubot_script = $(this).data('code') === 'hubot';
  as_emojis = $(this).data('code') === 'emoji';
  emojis = [];
  output = "";
  cols = parseInt($('#cols').val());
  $('.preview-canvas img').map(function(_, img) {
    var emoji;
    if (as_hubot_script) {
      emoji = '\'' + $(img).attr('title') + '\'';
      if (!(emojis.indexOf(emoji) >= 0)) {
        emojis.push(emoji);
      }
      output += emojis.indexOf(emoji);
    } else if (as_emojis) {
      emoji = $(img).attr('title');
      output += emoji;
    }
    if ((_ + 1) % cols === 0) {
      if (as_hubot_script) {
        return output += "|";
      } else if (as_emojis) {
        return output += "<br />";
      }
    }
  });
  if (as_hubot_script) {
    output = output.slice(0, output.length - 1);
    output = "\"" + window.target_emoji + "\": {<br/>&nbsp;&nbsp;emoji: [ " + (emojis.join(", ")) + " ]<br/>&nbsp;&nbsp;pattern: \"" + output + "\"<br/>}";
  }
  return $('.output').html(output);
});

$(document).on('click', '[id*="edit-"]', function() {
  var num;
  num = this.id.split('-')[1];
  $('.cell').filter("[data-number='" + num + "']").addClass('selected').attr('data-number', '');
  return $(".set-" + num).remove();
});

$(document).on('click', '#preview', function() {
  var preview, width;
  preview = $('.preview-canvas');
  preview.html('');
  width = preview.attr('data-size');
  return $('.cell').map(function(_, ele) {
    var cols, emoji, img_url, num;
    cols = parseInt($('#cols').val());
    num = $(ele).attr('data-number') || 'none';
    emoji = $("#emoji-" + num).val();
    img_url = $("[title='" + emoji + "']").attr('src');
    preview.append($("<img src='" + img_url + "' title='" + emoji + "' width='" + width + "  ' />"));
    if ((_ + 1) % cols === 0) {
      return preview.append($("<br />"));
    }
  });
});

resetAll = function() {
  $("#number").val(0);
  return $("[id*='emoji-'").not("#emoji-none").remove();
};

setGrid = function() {
  var cell_size, cols, grid, rows, wrapper_width;
  rows = parseInt($('#rows').val());
  cols = parseInt($('#cols').val());
  grid = $('.grid');
  wrapper_width = grid.width();
  console.log(wrapper_width);
  cell_size = wrapper_width / cols;
  $('.preview-canvas').attr('data-size', cell_size);
  grid.html('');
  (cols * rows).times(function() {
    return grid.append("<div class='cell' style='width: " + cell_size + "px; height: " + cell_size + "px;'>");
  });
  return resetAll();
};

Number.prototype.times = function(fn) {
  var _i, _ref;
  for (_i = 1, _ref = this.valueOf(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
    fn();
  }
};

markSelected = function(ele) {
  if (!(ele.attr('data-number'))) {
    return ele.toggleClass('selected');
  }
};

setNumber = function(num) {
  num || (num = parseInt($("#number").val()));
  $('.cell.selected').attr('data-number', num);
  $('.cell.selected').removeClass('selected');
  $('.set-emojis').append("<div class='set-" + num + "'>SET " + num + " <input autocomplete='emojis' type='text' id='emoji-" + num + "' placeholder='" + num + "' /><button id='edit-" + num + "'>Edit set " + num + " selection</button></div>");
  return $("#number").val(num + 1);
};
