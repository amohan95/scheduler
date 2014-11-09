// GLOBALS //

var SEMESTER = '20151';
var TERMS = ["Spring", "Summer", "Fall"];
var DEFAULT_PLAN_NAME = "Your Title Here";

var storage = new PlanStorage();
var selectedSemester = null;
var isSaved = true;
var planName = DEFAULT_PLAN_NAME;

// PLAN OBJECTS //

function PlanStorage() {
  this.semesters = [];

  this.addSemester = function(semester) {
    this.semesters.push(semester);
  }

  this.addCourse = function(semester, course) {
    var sem = this.getSemester(semester);
    if(sem !== null) {
      sem.addCourse(course);
      $("#" + semester + " .total-units").text(sem.units);
      setSaved(false);
    }
  }

  this.removeCourse = function(semester, courseName) {
    var sem = this.getSemester(semester);
    if(sem !== null) {
      sem.removeCourse(courseName);
      $("#" + semester + " .total-units").text(sem.units);
      setSaved(false);
    }
  }

  this.getSemester = function(semester) {
    for(var i = 0; i < this.semesters.length; ++i) {
      if(this.semesters[i].code == semester) return this.semesters[i];
    }
    return null;
  } 
}

function Semester(code) {
  this.code = code;
  this.courses = [];
  this.units = 0;

  this.addCourse = function(course) {
    this.courses.push(course);
    this.units += course.units;
  }

  this.getCourse = function(courseTitle) {
    var i = findCourse(course);
    return (i == -1 ? null : this.courses[i]);
  }

  this.removeCourse = function(courseTitle) {
    for(var i = this.courses.length - 1; i >= 0; --i) {
      if(this.courses[i].title === courseTitle) {
        var rem = this.courses.splice(i, 1)[0];
        this.units -= rem.units;
        return rem;
      } 
    }
  }

  this.findCourse = function(courseTitle) {
    for(var i = 0; i < this.courses.length; ++i) {
      if(this.courses[i].title === courseTitle) {
        return i;
      }
    }
    return -1;
  }
}

function Course(title, units) {
  this.title = title;
  this.units = parseInt(units);
}

// PLAN STORAGE //

function setSaved(saved) {
  if(!isSaved && saved) {
    $("#save-plan").removeClass("not-saved").addClass("saved");
  }
  else if(isSaved && !saved) {
    $("#save-plan").removeClass("saved").addClass("not-saved");
  }
  isSaved = saved;
}

function storeLocalChanges() {
  var planTitle = $("#plan-title").text();
  if(planTitle.length == 0) {
    alert("Please provide a title for your plan to be saved!");
    return;
  }

  for(var i = 0; i < localStorage.length; ++i) {
    if(planTitle === window.localStorage.key(i) && planTitle !== planName) {
      var r = confirm("Choosing this name will overwrite another plan, continue?");
      if(r === true) {
        break;
      }
      else {
        return;
      }
    }
  }
  planName = planTitle;
  localStorage[planName] = JSON.stringify(storage);
  setSaved(true);
}

// COURSE LIST POPULATION //

function setDeptList(semester) {
  $.ajax({
    url: "./ajax/get_departments.php",
    data: {semester: semester},
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      var deptSelect = $("#departments");
      deptSelect.append($("<option>").attr("value", "").text(""));
      for(var i = 0; i < data.length; ++i) {
        var code = data[i].code;
        var name = data[i].name;
        deptSelect.append($("<option>").attr("value", data[i].code).text(code + " - " + name));        
      }
      
      $('#departments_chosen > .chosen-single > div > b').show();
      $("#departments-loading").remove();

      deptSelect.prop('disabled', false);
      deptSelect.trigger("chosen:updated");
    },
    error: function(data) {

    }
  });
}

function setCourseList(semester, dept) {
  $.ajax({
    url: "./ajax/get_courses.php",
    data: {semester: semester, dept: dept},
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      var courseSelect = $("#courses");
      courseSelect.empty();
      courseSelect.append($("<option>").attr("value", "").text(""));
      for(var i = 0; i < data.length; ++i) {
        courseSelect.append($("<option>").text(data[i].id + " - " + data[i].title)
                                         .attr("data-units", data[i].units));
      }
      $('#courses_chosen > .chosen-single > div > b').show();
      $("#courses-loading").remove();

      courseSelect.prop('disabled', false);
      courseSelect.trigger("chosen:updated");
    },
    error: function(data) {

    }
  });
}

// SELECTION LOGIC //

function selectSemester(semesterCode) {
  if(selectedSemester != null) {
    selectedSemester.removeClass("selected");
  }
  selectedSemester = $("#" + semesterCode);
  selectedSemester.addClass("selected");
}

// TILE CREATION //

function createSemesterTile(year, semester) {
  var tile = $("<div>").addClass("semester-plan").addClass("semester-" + semester).attr("id", year + "" + semester);
  tile.append($("<div>").addClass("semester-title").html(TERMS[semester - 1] + " " + year +
                                                         " &mdash; Total Units: <span class='total-units'>0</span>"));
  tile.append($("<div>").addClass("course-tile-area"));
  tile.attr("data-year", year).attr("data-semester", semester);
  
  tile.click(function() {
    selectSemester(year + "" + semester);
  });

  storage.addSemester(new Semester(year + "" + semester));
  return tile;
}

function createCourseTile(name, units, remove) {
  var tile = $("<div>").addClass("course-tile");
  tile.append($("<div>").addClass("course-title").text(name));
  tile.append($("<div>").addClass("course-units-wrapper")
                        .append($("<div>").addClass("course-units").text("Units: " + units)));
  tile.attr("data-units", units);
  tile.append($("<div>").addClass("close").html("&times;").attr("hidden", !remove));
  return tile;
}

$(document).ready(function() {
  $("#departments").chosen({width: '85%', no_results_text: "No matching departments."})
                   .prop('disabled', true).trigger("chosen:updated");

  $("#courses").chosen({width: '85%', no_results_text: "No matching courses."})
               .prop('disabled', true).trigger("chosen:updated");
  $("#add-course-btn").attr("disabled", "disabled");

  $('#departments_chosen > .chosen-single').append($('<div>').attr('id', 'departments-loading').attr('class', 'loading'));
  $('#departments_chosen > .chosen-single > div > b').hide();
  setDeptList(SEMESTER);
  bindEvents();
  populateSemesters(SEMESTER);

  $("#plan-title").keypress(function(e){ return e.which != 13; });
});

function bindEvents() {
  $("#departments").change(function() {
    var dept = $('#departments option:selected').val();

    $('#courses').prop('disabled', true).trigger("chosen:updated");
    $('#courses_chosen > .chosen-single').append($('<div>').attr('id', 'courses-loading').attr('class', 'loading'));
    $('#courses_chosen > .chosen-single > div > b').hide();
    
    setCourseList(SEMESTER, dept);
    $("#add-course-btn").attr("disabled", "disabled");
  });

  $("#courses").change(function() {
    var selected = $("#courses option:selected");
    var name = selected.text();
    var units = selected.attr("data-units");
    var tile = createCourseTile(name, units, false);
    $("#course-tile-preview").empty().append(tile);
    $("#add-course-btn").removeAttr("disabled");
  });

  $("#add-course-btn").click(function() {
    var tile = $("#course-tile-preview .course-tile").clone();
    tile.children(".close").removeAttr("hidden").click(function() {
      console.log(tile.parents(".semester-plan"));
      var semesterId = $(tile.parents(".semester-plan")[0]).attr("id");
      storage.removeCourse(semesterId, tile.children(".course-title").text());
      tile.remove();
    });
    selectedSemester.children(".course-tile-area").append(tile);
    storage.addCourse(selectedSemester.attr("id"),
                      new Course(tile.children(".course-title").text(), tile.attr("data-units")));
  });

  $("#save-plan").click(function() { storeLocalChanges(); });
  $("#new-plan").click(function() {
    storage = new PlanStorage();
    $("#planning-area").empty();
    populateSemesters(SEMESTER);
    $("#plan-title").text("Your Title Here");
    setSaved(true);
  });
}

function populateSemesters(startSemester) {
  var startYear = parseInt(startSemester.substring(0, startSemester.length - 1));
  var startSem = parseInt(startSemester.substring(startSemester.length - 1, startSemester.length));
  var planningArea = $("#planning-area");
  for(var i = 0; i < 8; ++i) {
    planningArea.append(createSemesterTile(startYear, startSem));
    if(startSem == 3) startYear++;
    startSem = (startSem + 2) % 4;
  }
  selectSemester(startSemester);
}
