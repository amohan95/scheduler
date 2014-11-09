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
    }
  }

  this.removeCourse = function(semester, courseName) {
    var sem = this.getSemester(semester);
    if(sem !== null) {
      sem.removeCourse(courseName);
      $("#" + semester + " .total-units").text(sem.units);
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
    setSaved(false);
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
        setSaved(false);
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
  this.unitsText = units;
}

// PLAN STORAGE //

function setSaved(saved) {
  console.log('saving');
  if(!isSaved && saved) {
    $("#save-plan").removeClass("not-saved").addClass("saved");
  }
  else if(isSaved && !saved) {
    console.log("not saved");
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

function initFromStorage(planTitle) {
  var jsonObj = JSON.parse(localStorage[planTitle]);
  console.log(jsonObj);
  storage = new PlanStorage();
  
  $("#planning-area").empty();
  populateSemesters(SEMESTER, false);

  for(var i = 0; i < jsonObj.semesters.length; ++i) {
    var jSemester = jsonObj.semesters[i];
    var semester = new Semester(jSemester.code);
    for(var j = 0; j < jSemester.courses.length; ++j) {
      var jCourse = jSemester.courses[j];
      var course = new Course(jCourse.title, jCourse.unitsText);
      semester.addCourse(course);
      var tile = createCourseTile(course.title, course.unitsText, true);
      $("#" + semester.code + " .course-tile-area").append(tile);
    }
    storage.addSemester(semester);
    $("#" + semester.code + " .total-units").text(semester.units);
  }
  $.each($(".course-tile"), function(key, value) {
    var tile = $(value);
    tile.children(".close").click(function() {
      removeTile(tile);
    })  
  });
  $("#plan-title").text(planTitle);
  planName = planTitle;
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
  var startYear = semesterCode.substring(0, semesterCode.length - 1);
  var startSem = parseInt(semesterCode.substring(semesterCode.length - 1, semesterCode.length));
  $("#selected-semester").text(TERMS[startSem - 1] + " " + startYear);
  selectedSemester.addClass("selected");
}

// TILE CREATION //

function createSemesterTile(year, semester, create) {
  var tile = $("<div>").addClass("semester-plan").addClass("semester-" + semester).attr("id", year + "" + semester);
  tile.append($("<div>").addClass("semester-title").html(TERMS[semester - 1] + " " + year +
                                                         " &mdash; Total Units: <span class='total-units'>0</span>"));
  tile.append($("<div>").addClass("course-tile-area"));
  tile.attr("data-year", year).attr("data-semester", semester);
  
  tile.click(function() {
    selectSemester(year + "" + semester);
  });

  if(create) storage.addSemester(new Semester(year + "" + semester));
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
  populateSemesters(SEMESTER, true);
  if(localStorage.length !== 0) populateSavedPlans();
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
      removeTile(tile);
    });
    selectedSemester.children(".course-tile-area").append(tile);
    storage.addCourse(selectedSemester.attr("id"),
                      new Course(tile.children(".course-title").text(), tile.attr("data-units")));
  });

  $("#save-plan").click(function() {
    storeLocalChanges();
    populateSavedPlans();
  });
  $("#new-plan").click(function() {
    storage = new PlanStorage();
    $("#planning-area").empty();
    populateSemesters(SEMESTER, true);
    $("#plan-title").text("Your Title Here");
    setSaved(true);
  });

  $("#plan-title").keypress(function(e){ return e.which != 13; });
}

function removeTile(tile) {
  var semesterId = $(tile.parents(".semester-plan")[0]).attr("id");
  console.log(semesterId);
  storage.removeCourse(semesterId, tile.children(".course-title").text());
  tile.remove();
}

function populateSemesters(startSemester, create) {
  var startYear = parseInt(startSemester.substring(0, startSemester.length - 1));
  var startSem = parseInt(startSemester.substring(startSemester.length - 1, startSemester.length));
  var planningArea = $("#planning-area");
  for(var i = 0; i < 8; ++i) {
    planningArea.append(createSemesterTile(startYear, startSem, create));
    if(startSem == 3) startYear++;
    startSem = (startSem + 2) % 4;
  }
  selectSemester(startSemester);
}

function populateSavedPlans() {
  var savedList = $("#saved-list");
  savedList.empty();
  for(var i = 0; i < localStorage.length; ++i) {
    var key = localStorage.key(i);
    savedList.append($("<li>").append($("<a>").attr("href", "#").addClass("saved-plan").text(key)));
  }
  $(".saved-plan").click(function() {
    initFromStorage($(this).text());
  });
}
