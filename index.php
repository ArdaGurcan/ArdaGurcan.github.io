<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Arda Gürcan</title>
  <link rel="icon" type="image/png" href="ico.png">
  <meta name="keywords" content="Arda,Gürcan,Gurcan,Arda Gürcan,Arda Gurcan,ardagürcan,ardagurcan">
  <meta name="description" content="A website created by Arda Gürcan for fun.">
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
  <!-- <script src="lazyload.js"></script> -->
  <script src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js"></script>
  <script src="main.js"></script>
  <script src="cubelet.js"></script>
  <script src="easycam.js"></script>
  <script src="namegen.js"></script>
  <script>
    // if(location.hostname == "arda.games")
    //     $.getJSON('https://www.ardagurcan.com/projects.json', function (data) {
    //         let pathname = window.location.href.split("/").slice(-1)[0] 
    //         for (let i = 0; i < data.projects.length; i++) {
    //             let url=  "?"+data.projects[i].name.toLowerCase().replaceAll(" ","_")
                
    //             if(pathname == url || (data.projects[i].aliases && data.projects[i].aliases.indexOf(url) >= 0))
    //             {
    //                 if(data.projects[i].link)
    //                 {
    //                     location.href = data.projects[i].link
    //                 }
    //                 else
    //                 {

    //                     location.href = "https://ardagurcan.com/projects" + url.slice(1);
    //                 }
    //             }
                
    //         }

    //     });

    </script>
  <link id="mode" rel="stylesheet" type="text/css" href="dark.css">
  <script type="text/javascript">
    var dark = true;
    




    $(window).resize(function () {
      // canvasSize = createVector($("cube").width,$("cube").height)
      let canvasScale = (deviceSize() == 'xs' || deviceSize() == 'sm' || deviceSize() == 'md') ? .65 : .4
      // console.log(canvasScale)
      fixCanvas($("#cube").width() * canvasScale, $("#cube").width() * 5 / 6 * canvasScale)

      // document.getElementsByClassName("jumbotron-image")[0].setAttribute("width",(deviceSize() == 'xs' || deviceSize() == 'sm') ? "65%" : "30%");
      document.getElementsByClassName("last-edit")[0].innerHTML = (((window.innerWidth > 0) ? window.innerWidth :
        screen.width) <= 360) ? "" : "Last edited: " + lastEditDate.getDate() + "." + (lastEditDate.getMonth() +
        1) + "." + lastEditDate.getFullYear();
      // console.log(deviceSize());
    });

    var projects;

    function sortBy(categoryName) {
      $.getJSON('projects.json', function (data) {
        projects = data.projects;
        switch (categoryName) {
          case "a-z":
            projects.sort(function (a, b) {
              var nameA = a.name.toLowerCase(),
                nameB = b.name.toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            break;
          case "z-a":
            projects.sort(function (b, a) {
              var nameA = a.name.toLowerCase(),
                nameB = b.name.toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            break;
          case "new":
            projects.sort(function (b, a) {
              return new Date(a.releaseDate) - new Date(b.releaseDate);
            });
            break;
          case "old":
            projects.sort(function (a, b) {
              return new Date(a.releaseDate) - new Date(b.releaseDate);
            });
            break;
          case "category":
            projects.sort(function (a, b) {
              var categoryA = a.category.toLowerCase(),
                categoryB = b.category.toLowerCase();
              if (categoryA < categoryB) return -1;
              if (categoryA > categoryB) return 1;
              return 0;
            });
            break;
          case "engine":
            projects.sort(function (a, b) {
              var engineA = a.engine.toLowerCase(),
                engineB = b.engine.toLowerCase();
              if (engineA < engineB) return -1;
              if (engineA > engineB) return 1;
              return 0;
            });
            break;

        }
        var addString = "";
        for (var i = 0; i < projects.length; i++) {
          if (i % 2 == 0) {
            addString += '<div class="card-deck">';
          }
          addString +=
            '<div class="col-md-6 my-3">' +
            '<div class="card">' +
            '<a href="!LINK!"><img loading="lazy" src="!IMGLINK!" class="card-img-top cover-image" alt="!NAME! Cover Image"></a>' +
            '<div class="card-body" style="padding-bottom: 58px;position: relative;">' +
            '<h5 class="card-title">' +
            '<a href="!LINK!"><b>!NAME!</b></a>' + "!NEWPILL!" +
            '</h5>' +
            '<p class="card-text">' +
            '<b>Release Date:</b> ' + "!RELEASEDATE!" + '<br>' +
            '<b>Release Purpose:</b> ' + "!PURPOSE!" + '<br>' +
            '<b>Category:</b> ' + "!CATEGORY!" + '<br>' +
            '<b>Made with</b>: ' + "!ENGINE!" + '<br>' +
            '</p>' +
            '<a href="!LINK!" class="btn btn-primary" style="position: absolute;bottom: 20px">!BUTTONMESSAGE!' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>';
          addString = addString.replace(/!NAME!/g, projects[i].name);
          addString = addString.replace(/!NEWPILL!/g, ((today.getMonth() - (new Date(projects[i].releaseDate))
            .getMonth() + (12 * (today.getFullYear() - (new Date(projects[i].releaseDate)).getFullYear())) > 2
          ) ? '' : ' <span class="badge badge-pill badge-danger align-middle">New</span>'));
          addString = addString.replace(/!RELEASEDATE!/g, projects[i].releaseDate);
          if (projects[i].eventLink != undefined) {
            addString = addString.replace(/!PURPOSE!/g, '<a href="' + projects[i].eventLink + '">' + projects[i]
              .purpose + "</a>");
          } else {
            addString = addString.replace(/!PURPOSE!/g, projects[i].purpose);
          }
          addString = addString.replace(/!CATEGORY!/g, projects[i].category);
          addString = addString.replace(/!ENGINE!/g, projects[i].engine);
          addString = addString.replace(/!BUTTONMESSAGE!/g, (projects[i].category == "Game") ? "Play!" : "View!");
          addString = addString.replace(/!LINK!/g, (projects[i].fileType == "Website" && projects[i].link !=
            undefined) ? projects[i].link : "projects/" + projects[i].name.replaceAll(" ", "_").toLowerCase());
          addString = addString.replace(/!EVENTLINK!/g, (projects[i].eventLink != undefined) ? projects[i]
            .eventLink : "");
          addString = addString.replace(/!IMGLINK!/g, "projects/" + projects[i].name.replaceAll(" ", "_")
            .toLowerCase() + "/cover-image.png");

          if (i % 2 != 0) {
            addString += '</div>';
          }

        }
        document.getElementById("projects").innerHTML = addString;

      })
    }

    $(document).ready(function () {
      if(location.host[location.host.length-1] == "h")
    {
      document.title = document.title.replace("Arda","Clara")
      $(".navbar-brand")[0].innerHTML = $(".navbar-brand")[0].innerHTML.replace("Arda","Clara")
      $("body > footer > p")[0].innerHTML = $("body > footer > p")[0].innerHTML.replace("Arda","Clara")

    }
      $(".name").mouseenter(()=>{
        $("#monkey").css("opacity","40%")
      })
      $(".name").mouseleave(()=>{
        $("#monkey").css("opacity","0%")
      })
      $("#monkey").mouseenter(()=>{
        $("#monkey").css("opacity","40%")
      })
      $("#monkey").mouseleave(()=>{
        $("#monkey").css("opacity","0%")
      })

      // document.getElementsByClassName("jumbotron-image")[0].setAttribute("width",(deviceSize() == 'xs' || deviceSize() == 'sm') ? "65%" : "30%");


      // document.getElementsByClassName("jumbotron-heading")[0].innerHTML = (deviceSize() == 'xs') ? "Arda Gürcan" : "www.ardagurcan.com";
      lastEditDate = new Date(document.lastModified);
      document.getElementsByClassName("last-edit")[0].innerHTML = (((window.innerWidth > 0) ? window.innerWidth :
        screen.width) <= 360) ? "" : "Last edited: " + lastEditDate.getDate() + "." + (lastEditDate.getMonth() +
        1) + "." + lastEditDate.getFullYear();
      console.log("last edit: " + document.lastModified);

      if (localStorage.getItem("dark-mode") == "off") {
        dark = false;
        document.getElementById("mode").setAttribute("href", "light.css");
        document.getElementsByClassName("navbar-dark")[0].className = document.getElementsByClassName(
          "navbar-dark")[0].className.replace('navbar-dark', 'navbar-light');
        document.getElementsByClassName("toggle-icon")[0].setAttribute("src", "moon.svg");

        let buttons = $("button#controls,button#letter-controls")
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].setAttribute("class", "btn btn-outline-dark")
        }
        // document.getElementsByClassName("icon")[0].setAttribute("src","ico-light.png");
        // document.getElementsByClassName("icon")[1].setAttribute("data-src","ico-light.png");
        bgColor = "#fff"
        // redraw()

        localStorage.setItem("dark-mode", "off");
      }
      today = new Date();

      $.getJSON('projects.json', function (data) {

        projects = data.projects;


        for (let i = projects.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [projects[i], projects[j]] = [projects[j], projects[i]];
        }
        var addString = "";
        for (var i = 0; i < projects.length; i++) {
          if (i % 2 == 0) {
            addString += '<div class="card-deck">';
          }
          addString +=
            '<div class="col-md-6 my-3">' +
            '<div class="card">' +
            '<a href="!LINK!"><img loading="lazy" src="!IMGLINK!" class="card-img-top cover-image " alt="!NAME! Cover Image"></a>' +
            '<div class="card-body" style="padding-bottom: 58px;position: relative;">' +
            '<h5 class="card-title">' +
            '<a href="!LINK!"><b>!NAME!</b></a>' + "!NEWPILL!" +
            '</h5>' +
            '<p class="card-text">' +
            '<b>Release Date:</b> ' + "!RELEASEDATE!" + '<br>' +
            '<b>Release Purpose:</b> ' + "!PURPOSE!" + '<br>' +
            '<b>Category:</b> ' + "!CATEGORY!" + '<br>' +
            '<b>Made with</b>: ' + "!ENGINE!" + '<br>' +
            '</p>' +
            '<a href="!LINK!" class="btn btn-primary" style="position: absolute;bottom: 20px">!BUTTONMESSAGE!' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</div>';
          addString = addString.replace(/!NAME!/g, projects[i].name);
          addString = addString.replace(/!NEWPILL!/g, ((today.getMonth() - (new Date(projects[i].releaseDate))
              .getMonth() + (12 * (today.getFullYear() - (new Date(projects[i].releaseDate))
                .getFullYear())) > 2) ? '' :
            ' <span class="badge badge-pill badge-danger align-middle">New</span>'));
          addString = addString.replace(/!RELEASEDATE!/g, projects[i].releaseDate);
          if (projects[i].eventLink != undefined) {
            addString = addString.replace(/!PURPOSE!/g, '<a href="' + projects[i].eventLink + '">' + projects[i]
              .purpose + "</a>");
          } else {
            addString = addString.replace(/!PURPOSE!/g, projects[i].purpose);
          }
          addString = addString.replace(/!CATEGORY!/g, projects[i].category);
          addString = addString.replace(/!ENGINE!/g, projects[i].engine);
          addString = addString.replace(/!BUTTONMESSAGE!/g, (projects[i].category == "Game") ? "Play!" :
            "View!");
          addString = addString.replace(/!LINK!/g, (projects[i].fileType == "Website" && projects[i].link !=
            undefined) ? projects[i].link : "projects/" + projects[i].name.replaceAll(" ", "_").toLowerCase());
          addString = addString.replace(/!IMGLINK!/g, "projects/" + projects[i].name.replaceAll(" ", "_")
            .toLowerCase() + "/cover-image.png");

          if (i % 2 != 0) {
            addString += '</div>';
          }

        }
        document.getElementById("projects").innerHTML = addString;


      })
    });

    function writeProjects() {

    }

    function toggleMode() {
      dark = !dark;
      if (dark) {
        document.getElementById("mode").setAttribute("href", "dark.css");
        document.getElementsByClassName("navbar-light")[0].className = document.getElementsByClassName("navbar-light")[
          0].className.replace('navbar-light', 'navbar-dark');
        document.getElementsByClassName("toggle-icon")[0].setAttribute("src", "sun.svg");
        // document.getElementsByClassName("icon")[0].setAttribute("src","ico.png");
        // document.getElementsByClassName("icon")[1].setAttribute("src","ico.png");
        let buttons = $("button#controls,button#letter-controls")
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].setAttribute("class", "btn btn-outline-secondary")
        }
        bgColor = "#141518";
        localStorage.setItem("dark-mode", "on");

      } else {
        document.getElementById("mode").setAttribute("href", "light.css");
        document.getElementsByClassName("navbar-dark")[0].className = document.getElementsByClassName("navbar-dark")[0]
          .className.replace('navbar-dark', 'navbar-light');
        document.getElementsByClassName("toggle-icon")[0].setAttribute("src", "moon.svg");
        // document.getElementsByClassName("icon")[0].setAttribute("src","ico-light.png");
        // document.getElementsByClassName("icon")[1].setAttribute("src","ico-light.png");
        let buttons = $("button#controls,button#letter-controls")
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].setAttribute("class", "btn btn-outline-dark")
        }
        bgColor = "#fff";
        localStorage.setItem("dark-mode", "off");
      }
      redraw()

    }
  </script>
</head>

<body>


  <nav class="navbar navbar-expand-md navbar-dark bg-light sticky-top">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img class="icon" src="ico.png" width="30" height="30" class="d-inline-block align-top" alt="logo">
        Arda Gürcan
      </a>

      <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse" id="navbarNav">
        <div class="container">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link active" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About Me</a>
            </li>
          </ul>

        </div>
        <div class="container">
          <img src="sun.svg" width="20" height="20" class="toggle-icon align-bottom" onclick="toggleMode();"
            title="Toggle dark mode" style="float: right;" alt="Toggle dark mode">
        </div>
      </div>
    </div>
  </nav>
  <nav class="navbar navbar-expand-md navbar-dark bg-light" style="top: -1px">
    <div class="container justify-content-end">
      <nav class="nav-item active dropdown">
        <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          Sort by
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="javascript: sortBy('a-z')">A-Z</a>
          <a class="dropdown-item" href="javascript: sortBy('z-a')">Z-A</a>
          <a class="dropdown-item" href="javascript: sortBy('new')">Newest</a>
          <a class="dropdown-item" href="javascript: sortBy('old')">Oldest</a>
          <a class="dropdown-item" href="javascript: sortBy('category')">Category</a>
          <a class="dropdown-item" href="javascript: sortBy('engine')">Engine</a>
        </div>
      </nav>
  </nav>

  <div class="container mt-4">
    <div class="jumbotron text-center" style="padding-top: 0%;">
      <div class="container">
        <div id="cube"></div>
        <div class="controls">

        <div class="btn-group" role="group">
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">f</button>
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">b</button>
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">r</button>
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">l</button>
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">u</button>
          <button type="button" onclick="pressKey(this)" id="letter-controls"
            class="btn btn-outline-secondary">d</button>

        </div>
        <div class="btn-group" role="group">
          <button type="button" onclick="pressKey(this)" id="controls" class="btn btn-outline-secondary">Shift</button>
          <button type="button" onclick="pressKey(this)" id="controls" class="btn btn-outline-secondary">Tab</button>
        </div>
        <br>
        <br>
      </div>

        <!-- <img data-src="ico.png" width="30%" class="jumbotron-image icon lazyload"> -->
        <!-- <br>
          <br> -->
          <span style="display:inline; font-size: 30px;visibility: hidden;">🐒</span>
          <h1 style="display:inline-block" class="jumbotron-heading .d-none name"></h1>
          <a href="https://en.wikipedia.org/wiki/Infinite_monkey_theorem" style="text-decoration: none;display:inline; font-size: 30px; opacity: 0%;"target="_blank" id="monkey">🐒</a>
        <p class="lead text-muted detail"></p>
      </div>
    </div>
  </div>


  <div class="container" id="projects">
  </div>

  <footer class="container py-2">
    <hr>
    <p style="text-align:left;">
      Made by Arda Gürcan
      <span style="float:right;font-style: italic"><span class="last-edit"></span></span>
    </p>
  </footer>
    <?php 
    include("ip.php")
    ?>
</body>

</html>