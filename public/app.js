$(document).click("#letsSrape", function () {


  $.getJSON("/articles", function (data) {


    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        "<div class='card' style='width: 25rem' data-id='"
        + data[i]._id + "'>" + "<img class='card-img-top' alt='...' src='"
        + data[i].img + "'>" + "<div class='card-body'>" + "<h5 class='card-head'>"
        + data[i].title + "</h5>" + "<br />" + "<a class'card-text'>" + "<p>"
        + data[i].summary + "<p>"
        + data[i].link + "</a>" + "<br>" + "<br>" + "<button id='save' class='btn btn-success' data-id='"
        + data[i]._id + "'>" + "Save" + "</button>" + "<br>" + "<button id='commentArticle' class='btn btn-secondary' data-id='"
        + data[i]._id + "'>" + "Comment" + "</button>" + "<button id='deleteArticle' class='btn btn-dark' data-id='"
        + data[i]._id + "'>" + "Delete" + "</button>" + "</div>" + "</div>");
      // return alert(data.length +  "articles found")
    }
  });
})


// $(document).on("click", "#deleteArticle", function() {
//   var thisId = $(this).attr("data-id");
//   thisId.parent().delete();

// })

$(document).on("click", "#commentArticle", function () {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);

      $(".card").append("<input class='form-control' type= 'text' placeholder ='Write your comment here' id='titleinput' name='title' >");
      $(".card").append("<button class='btn btn-defualt 'data-id='" + data._id + "' id='savenote'>Save Comment</button>");
      $(".card").append("<button class='btn btn-danger' data-id='" + data._id + "' id='deleteComment'>Delete Comment</button>");
      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comment.title);

      }
    });
});

$(document).on("click", "#deleteArticle", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
    data: { thisId: thisId }
  }).then(function () {
    $("#articles").empty();
    setTimeout(function () { alert("This article has been deleted."); }, 1000);
  })
})

//Save Article button
$(".save").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  }).done(function (data) {
    window.location = "/"
  })
});


// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  alert("Thank you for your comment!")
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

