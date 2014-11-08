<?php

class Course {

	public $id;
	public $title;
	public $description;
	public $semester;
	public $units;

	public function __construct($json_object, $semester) {
		$this->semester = $semester;
		$this->id = $json_object['ScheduledCourseID'];
		$this->title = $json_object['CourseData']['title'];
		$this->description = $json_object['CourseData']['description'];
		$this->units = $json_object['CourseData']['units'];
	}

	public function getId() {
		return $this->id;
	}

	public function getTitle() {
		return $this->title;
	}

	public function getDescription() {
		return $this->description;
	}

	public function getSemester() {
		return $this->semester;
	}

	public function getUnits() {
		return $this->units;
	}
}
?>
