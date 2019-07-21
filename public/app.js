$(".articlesCont").hide();

$(document).click("#letsSrape", function () {

$(".articlesCont").show();

  $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {

      $("#artCount").html(data.length + " articles found")
   
      $("#articles").append(
        "<div class='card' style='width: 25rem' data-id='"
        + data[i]._id + "'>" + "<img class='card-img-top' alt='...' src='"
        + data[i].img + "'>" + "<div class='card-body'>" + "<h5 class='card-header'>"
        + data[i].title + "</h5>" + "<br />" + "<p>" + "Link:" + "<p>" + 
        "<a class='card-text' href='" + data[i].link + "'>" +  data[i].link + "</a>" + "<br>" + "<br>" + "<button id='save' class='btn btn-success' data-id='"
        + data[i]._id + "'>" + "Save" + "</button>"  + "<button id='commentArticle' class='btn btn-secondary' data-id='"
        + data[i]._id + "'>" + "Comment" + "</button>"  +"<button id='deleteArticle' class='btn btn-dark' data-id='"
        + data[i]._id + "'>" + "Delete" + "</button>" + "<div id='savedCom'>"+"</div>" + "</div>" + "</div>" );
     
    }
  });
})


$(document).on("click", "#commentArticle", function () {

  // $("#comments").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function (data) {
 
console.log(data)
      $("#savedCom").append("<input class='form-control' type= 'text' placeholder ='Write your comment here' id='titleinput' name='title' >");
      $("#savedCom").append("<button class='btn btn-light 'data-id='" + data._id + "' id='savenote'>Save Comment</button>");
      // $(".card").append("<button class='btn btn-danger' data-id='" + data._id + "' id='deleteComment'>Delete Comment</button>");
      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        $("#savedCom").val(data.comment.title);

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
$(document).on("click", "#save", function () {
  console.log("works")
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  }).done(function (data) {
    location.reload()
  })
});


// When you click the savenote button
$(document).on("click", "#savenote", function () {

  var thisId = $(this).attr("data-id");
  alert("Thank you for your comment!")

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })

    .then(function (data) {
      console.log(data);
      $("#comments").empty();
    });


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

