$(() => {
  const catLookup = {
    '1': 'read',
    '2': 'eat',
    '3': 'buy',
    '4': 'watch',
    '5': 'done'
  };

  $.ajax({
    method: 'GET',
    url: '/your-lists'
  }).done((rows) => {
    for(row of rows) {
      let thisClass = row.category;
      if (!thisClass) {
        thisClass = 'uncat';
      }
      if (row.priority) {
        $('<div>').addClass('list-item')
        .append($('<span>').addClass('check').text('V')
          .append($('<span>').addClass(`${thisClass} priority list-item`).text(row.to_do)
          .append($('<span>').addClass('options').text('&'))
          )
        )
        .prependTo(`div#${thisClass}`);
      } else {
        $('<div>').addClass('list-item')
        .append($('<span>').addClass('check').text('V')
          .append($('<span>').addClass(`${thisClass} list-item`).text(row.to_do)
          .append($('<span>').addClass('options').text('&'))
          )
        )
        .prependTo(`div#${thisClass}`);
      }
    }
  });
});


