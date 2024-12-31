DROP DATABASE IF EXISTS `student_payment_system`; 
CREATE DATABASE `student_payment_system`;
USE `student_payment_system`;

CREATE TABLE `organizations` (
   `code` VARCHAR(10),
   `name` VARCHAR(100) NOT NULL,
   `email` VARCHAR(100) NOT NULL,
   CONSTRAINT `pk_organization_code` PRIMARY KEY (`code`),
   CONSTRAINT `unique_name` UNIQUE (`name`),
   CONSTRAINT `unique_email` UNIQUE (`email`)
);

CREATE TABLE `programs` (
	`organization_code` VARCHAR(10),
	`code` VARCHAR(10),
	CONSTRAINT `pk_programs` PRIMARY KEY(`code`, `organization_code`),
	CONSTRAINT `fk_program_organization` FOREIGN KEY(`organization_code`) REFERENCES `organizations`(`code`)
);

CREATE TABLE `contributions` (
   `name` VARCHAR(50),
   `amount` INT DEFAULT 0,
   `academic_year` CHAR(9) NOT NULL,
   `collecting_org_code` VARCHAR(10) NOT NULL,
   CONSTRAINT `pk_items` PRIMARY KEY (`name`, `academic_year`),
   CONSTRAINT `fk_item_organization` FOREIGN KEY (`collecting_org_code`) REFERENCES `organizations`(`code`)
);

CREATE TABLE `students` (
	`full_name` VARCHAR(155),
   `id_number` CHAR(9),
   `gender` ENUM('M', 'F'),
   `year_level` ENUM('1', '2', '3', '4'),
   `program_code` VARCHAR(10) NOT NULL,
   `note` VARCHAR(255) DEFAULT '',
   CONSTRAINT `unique_full_name` UNIQUE (`full_name`),
   CONSTRAINT `pk_student_id_number` PRIMARY KEY (`id_number`),
   CONSTRAINT `fk_student_program` FOREIGN KEY(`program_code`) REFERENCES `programs`(`code`) 
);

CREATE TABLE `transactions` (
   `id` INT UNSIGNED AUTO_INCREMENT,
   `datetime` DATETIME DEFAULT CURRENT_TIMESTAMP,
   `contribution_name` VARCHAR(50) NOT NULL,
   `contribution_ay` CHAR(9) NOT NULL,
   `payer_id` CHAR(9) NOT NULL,
   `payment_mode` CHAR(4) NOT NULL,
   `amount` INT,
   `transaction_message` VARCHAR(255) DEFAULT '',
   `status` ENUM('Accepted', 'Pending'),
   CONSTRAINT `pk_transaction_id` PRIMARY KEY (`id`),
   CONSTRAINT `fk_transaction_contribution` FOREIGN KEY (`contribution_name`, `contribution_ay`) REFERENCES `contributions`(`name`, `academic_year`) ON UPDATE CASCADE,
   CONSTRAINT `fk_transaction_student` FOREIGN KEY (`payer_id`) REFERENCES `students`(`id_number`) ON UPDATE CASCADE ON DELETE NO ACTION 
);

-- CREATE TABLE `users`(
--    `user_id` CHAR(9),
--    `password` VARCHAR(255) NOT NULL,
--    CONSTRAINT `pk_user` PRIMARY KEY(`user_id`),
--    CONSTRAINT `fk_user_officer` FOREIGN KEY(`user_id`) REFERENCES `students`(`id_number`)
-- );

    
# Set Initial Values
INSERT INTO `organizations` (`code`, `name`, `email`)
VALUES ('CCS-EC', 'College of Computer Studies Executive Council', 'ccs@g.msuiit.edu.ph');

INSERT INTO `programs` (`organization_code`, `code`)
VALUES 	('CCS-EC', 'BSCS'),
('CCS-EC', 'BSCA'),
('CCS-EC', 'BSIT'),
('CCS-EC', 'BSIS');

INSERT INTO `contributions` (`name`, `amount`, `academic_year`, `collecting_org_code`) 
VALUES 	('1st Semester', 0, '2024-2025', 'CCS-EC'),
('2nd Semester', 0, '2024-2025', 'CCS-EC');


