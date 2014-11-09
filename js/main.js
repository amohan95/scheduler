// GLOBALS //
var SEMESTER = '20151';
var SEMESTERS = ["Spring", "Summer", "Fall"];
var YEAR = 2015
var storage = new PlanStorage();
var selectedSemester = null;

// PLAN OBJECTS //

function PlanStorage() {
  this.semesters = [];

  this.addSemester = function(semester) {
    this.semesters.push(semester);
  }
}

function Semester(year, semester) {
  this.year = year;
  this.semester = semester;
  this.courses = [];
  this.units = 0;

  this.addCourse = function(course) {
    if(this.findCourse(course.title) == -1) {
      this.courses.push(course);
    }
  }

  this.getCourse = function(courseTitle) {
    var i = findCourse(course);
    return (i == -1 ? null : this.courses[i]);
  }

  this.removeCourse = function(course) {

  }

  this.findCourse = function(courseTitle) {
    for(var i = 0; i < courses.length; ++i) {
      if(courses[i].title === courseTitle) {
        return i;
      }
    }
    return -1;
  }
}

function Course(title, units) {
  this.units = parseInt(units);
  this.title = title;
}

// PLAN STORAGE //

function storeLocalChanges() {
  var storageObject = new Object();

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
  console.log(selectedSemester);
}

// TILE CREATION //

function createSemesterTile(year, semester) {
  var tile = $("<div>").addClass("semester-plan").addClass("semester-" + semester).attr("id", year + "" + semester);
  tile.append($("<div>").addClass("semester-title").text(SEMESTERS[semester - 1] + " " + year));
  tile.attr("data-year", year).attr("data-semester", semester);
  
  tile.click(function() {
    selectSemester(year + "" + semester);
  });
  
  storage.addSemester(new Semester(year, semester));
  return tile;
}

function createCourseTile(name, units, remove) {
  var tile = $("<div>").addClass("course-tile");
  tile.append($("<div>").addClass("course-title").text(name));
  tile.append($("<div>").addClass("course-units-wrapper")
                        .append($("<div>").addClass("course-units").text("Units: " + units)));
  tile.attr("data-units", units);
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
