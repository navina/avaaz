CREATE DATABASE zariya;

CREATE USER 'zariya'@'localhost' IDENTIFIED BY 'zariyaPass123';
GRANT ALL PRIVILEGES ON zariya.* TO 'zariya'@'localhost';

USE zariya;

CREATE TABLE IF NOT EXISTS person ( \
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'identifier for a person', \
	firstName VARCHAR(50), \
	lastName VARCHAR(50), \
	email VARCHAR(50), \
	phone VARCHAR(15) \
	);

CREATE TABLE IF NOT EXISTS content ( \
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
	fileName VARCHAR(50) NOT NULL \
);

CREATE TABLE IF NOT EXISTS incident ( \
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
	categories VARCHAR(200) NOT NULL COMMENT 'Standard values belongs to set (eve teasing, voyeurism, acid violence, stalking, rape, marital rape, disrobing, domestic violence); Allows free text', \
	incidentDate DATE NOT NULL, \
	incidentTime TIME NOT NULL, \
	location VARCHAR(200), \
	coordinates VARCHAR(50), \
	comment TEXT, \
	mediaId INT REFERENCES content (id), \
	firstTime ENUM('Y', 'N') NOT NULL, \
	knownAssailant ENUM('Y', 'N') NOT NULL, \
	reporterRelation ENUM('SURVIVOR', 'FRIEND_OF_SURVIVOR', 'RELATIVE_OF_SURVIVOR', 'NOT_RELATED') NOT NULL
);

CREATE TABLE IF NOT EXISTS relationship ( \
	personId INT UNSIGNED REFERENCES person (id), \
	incidentId INT UNSIGNED REFERENCES incident (id), \
	assailantId INT UNSIGNED NULL
);


