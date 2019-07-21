$(".articlesCont").hide();

$(document).click("#letsSrape", function () {

  $(".articlesCont").show();
  $("#savedArticles").hide();

  $.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {

      $("#artCount").html(data.length + " articles found")

      $("#articles").append(
        "<div class='card' style='width: 25rem' data-id='"
        + data[i]._id + "'>"  + "<div class='card-body'>" + "<h5 class='card-header'>"
        + data[i].title + "</h5>" + "<br />" + "<p>" + "Link:" + "<p>" +
        "<a class='card-text' href='" + data[i].link + "'>" + data[i].link + "</a>" + "<br>" + "<br>" + "<button id='saveArt' class='btn btn-outline-info' data-id='"
        + data[i]._id + "'>" + "Save" + "</button>" + "<button id='commentArticle' class='btn btn-outline-success' data-id='"
        + data[i]._id + "'>" + "Comment" + "</button>" + "<button id='deleteArticle' class='btn btn-outline-dark' data-id='"
        + data[i]._id + "'>" + "Delete" + "</button>" + "<div id='commentForm'>" + "</div>" + "</div>" + "</div>");

    }
  });

})


$(document).one("click", "#commentArticle", function () {

  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function (data) {

      console.log(data)
      $(".card" ).append("<input class='form-control' type= 'text' placeholder ='Write your comment here' id='titleinput' name='title' >");
      $(".card").append("<button class='btn btn-outline-success 'data-id='" + data._id + "' id='savenote'>Save Comment</button>");
      $(".card").append("<div id='savedCom'>" + "Previous Comments: " + "</div>")

      if (data.comment) {
        $("#savedCom").val(data.comment.title);

      }
    });
});

$(document).on("click", "#deleteArticle", function () {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
    data: { thisId: thisId }
  }).then(function () {
    $("#articles").empty();
    setTimeout(function () { alert("This article has been deleted."); }, 1000);
    location.reload()
  })
})

//Save Article button
$(document).on("click", "#saveArt", function() {
  console.log("working")
  $(this).addClass("disabled");
  let thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId,
   
  })
  
  .then(function(data) {
    alert("Your article has been saved")
      console.log(data);
  });
});


  $.getJSON("/saved", function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      $("#saveArticles").html(data.length + " articles found")
      $(".savedCont").append(  "<div class='card' style='width: 25rem' data-id='"
      + data[i]._id + "'>"  + "<div class='card-body'>" + "<h5 class='card-header'>"
      + data[i].title + "</h5>" + "<br />" + "<p>" + "Link:" + "<p>" +
      "<a class='card-text' href='" + data[i].link + "'>" + data[i].link + "</a>" + "<br>" + "<br>"  + "<button id='commentArticle' class='btn btn-outline-success' data-id='"
      + data[i]._id + "'>" + "Comment" + "</button>" + "<button id='deleteArticle' class='btn btn-outline-dark' data-id='"
      + data[i]._id + "'>" + "Delete" + "</button>" + "<div id='commentForm'>" + "</div>"+ "<div id='savedCom'>" + "</div>" + "</div>" + "</div>")
    }
 
  });



// When you click the save comment button
$(document).on("click", "#savenote", function () {

  let thisId = $(this).attr("data-id");
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

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

