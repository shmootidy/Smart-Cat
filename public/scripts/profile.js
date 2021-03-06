$(() => {


  function renderUserInfo(data) {
    const userName = data[0].name;
    const userEmail = data[0].email;

    $('<div>').addClass('profile-data')
      .append($('<div>').addClass('username').text(`Username: ${userName}`))
      .append($('<div>').addClass('email').text(`Email: ${userEmail}`))
      .append($('<button>').addClass('edit').text('edit'))
      .appendTo('.profile-flexbox');

    $('<form>').addClass('profile-form hidden')
      .append($(`<input type="text" name="name" value="${userName}">`).addClass('input'))
      .append($(`<input type="text" name="email" value="${userEmail}">`).addClass('input'))
      .append($('<input type="submit" value="Update Profile">').addClass('button'))
      .appendTo('.profile-flexbox');
}


  $.ajax({
    method: 'GET',
    url: '/profile/info'
  }).then( (rows) => {
    renderUserInfo(rows);
    makeEvents();
  })


  function makeEvents() {

    $('button.edit').on('click', function() {
      $(this).parents('.profile-data').toggle().toggleClass('hidden');
      $('.profile-form').toggle().toggleClass('hidden');
    });

    $('.profile-form').on('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let userName = $(this).children("[name='name']").val();
      let email = $(this).children("[name='email']").val();
        console.log(userName);
        console.log(email);
      $.ajax({
        method: 'POST',
        url: '/profile/info?_method=PATCH',
        data: {
          userName,
          email
        }
      })
      .then((rows) => {
        $('.profile-flexbox').empty();
        renderUserInfo(rows);
        makeEvents();
      })
      });

  }

});
