var SEMESTER = '20151';

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

$(document).ready(function() {
  $("#departments").chosen({width: '85%', no_results_text: "No matching departments."})
                   .prop('disabled', true).trigger("chosen:updated");

  $("#courses").chosen({width: '85%', no_results_text: "No matching courses."})
               .prop('disabled', true).trigger("chosen:updated");

  $('#departments_chosen > .chosen-single').append($('<div>').attr('id', 'departments-loading').attr('class', 'loading'));
  $('#departments_chosen > .chosen-single > div > b').hide();
  setDeptList(SEMESTER);
  
  bindEvents();
});

function bindEvents() {
  $("#departments").change(function() {
    var dept = $('#departments option:selected').val();

    $('#courses').prop('disabled', true).trigger("chosen:updated");
    $('#courses_chosen > .chosen-single').append($('<div>').attr('id', 'courses-loading').attr('class', 'loading'));
    $('#courses_chosen > .chosen-single > div > b').hide();
    
    setCourseList(SEMESTER, dept);
  });

  $("#courses").change(function() {

  });
}
