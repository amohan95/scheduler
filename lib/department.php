<?php
class Department {
	public $code;
	public $name;
	public $type;

	public function __construct($json_object) {
		$this->code = $json_object['code'];
		$this->name = $json_object['name'];
		$this->type = $json_object['type'];
	}

	public function getCode() {
		return $this->code;
	}

	public function getName() {
		return $this->name;
	}

	public function getType() {
		return $this->type;
	}
}
?>