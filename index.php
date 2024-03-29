<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="css/bootstrap.min.css">
  <style>
    body {
      padding-top: 50px;
      padding-bottom: 20px;
    }
  </style>
  <link rel="stylesheet" href="css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="chosen/chosen.min.css">
  <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="css/main.css">

  <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
</head>
<body>
  <!--[if lt IE 7]>
  <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">SCheduler</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">My Saved Plans <span class="caret"></span>
            </a>
            <ul id="saved-list" class="dropdown-menu" role="menu">
              <li><a href="#">None Currently!</a></li>
            </ul>
          </li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div>
  </div>

  <div id="main-wrapper">
    <div id="sidebar">
      <h4>Departments</h4>
      <select id="departments" data-placeholder="Department" name="departments"></select>
      <h4>Courses</h4>
      <select id="courses" data-placeholder="Course" name="courses"></select>
      <div id="course-tile-preview" style="margin: 25px 0 25px 0;"></div>
      <div id="add-course-btn" class="btn btn-default">Add Course</div>
      <div style="margin-top: 10px;">Selected Semester: <span id="selected-semester"></span></div>
    </div>
    <div id="planning-wrapper">
      <div id="planning-menu-bar">
        <div id="plan-title" contenteditable="true">Your Title Here</div>
        <i id="new-plan" class="fa fa-plus fa-2x pull-left" title="New Plan"></i>
        <i id="save-plan" class="fa fa-save fa-2x pull-right saved" title="Save"></i>
      </div>
      <div id="planning-area"></div>
    </div>
  </div>
  <hr>
  <footer>
    <p>&copy; Michelle &amp; Ananth 2014</p>
  </footer>


  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"><\/script>')</script>

  <script src="js/vendor/bootstrap.min.js"></script>
  <script src="chosen/chosen.jquery.min.js"></script>
  <script src="js/main.js"></script>

  <script>
    (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
      function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
    e=o.createElement(i);r=o.getElementsByTagName(i)[0];
    e.src='//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    ga('create','UA-XXXXX-X');ga('send','pageview');
  </script>
</body>
</html>
