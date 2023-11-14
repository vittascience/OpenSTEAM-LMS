ALTER TABLE `classroom_users_link_courses` ADD `reference` VARCHAR(16) NULL AFTER `course_state`, ADD `activities_references` TEXT NULL AFTER `reference`;

ALTER TABLE `learn_courses` ADD `optional_data` TEXT NULL AFTER `format`;