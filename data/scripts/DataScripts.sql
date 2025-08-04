-- This is the initial data script for Time 4 Trivia
-- Running this script will insert the intial data for the application
use Time4Trivia;

-- Insert Initial Data
insert into Users  (username, password, email, firstname, lastname) 
	values ('admin', '$2b$10$8Zq3JH4WY6CRwQmitid6V.9oFlM/RKo3ATcXqGWdoXoW14SmAJ7d6', 'admin@test.com', 'admin', 'admin');
insert into Users (username, password, email, firstname, lastname) 
	values ('test', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'test@test.com', 'test', 'test');
insert into Users (username, password, email, firstname, lastname)
	values ('phil', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'phil@gmail.com', 'Phil', 'Philerton');

-- -- Insert a user
-- INSERT INTO Users (username, password) VALUES ('admin1', 'hashedpass');

-- -- Then assign the role
-- INSERT INTO UserRoles (userId, roleId)
-- SELECT u.userId, r.roleId
-- FROM Users u, Roles r
-- WHERE u.username = 'admin1' AND r.role = 'admin';


insert into Roles (Role, RoleDescription) 
	values ('user', 'standard user role');
insert into Roles (Role, RoleDescription) 
	values ('admin', 'site admins');

set @userId = (select UserId from Users where username = 'test');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'phil');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'admin');
set @roleId = (select RoleId from Roles where Role = 'admin');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);




-- test data
-- select * from users;
-- select * from roles;
-- select * from userroles;

-- SELECT u.userId, u.username, u.password, r.role, u.disabled
-- FROM users u
-- LEFT JOIN userroles ur ON u.userId = ur.userId
-- LEFT JOIN roles r ON r.roleId = ur.roleId;


SELECT u.username, r.role
FROM Users u
JOIN UserRoles ur ON u.userId = ur.userId
JOIN Roles r ON ur.roleId = r.roleId;

UPDATE Users SET Enabled = 1 WHERE username = 'admin';

-- SELECT * FROM Users WHERE Username = ? AND Enabled = 1
-- UPDATE Users SET Enabled = 1;



-- Insert sample trivia questions
insert into Questions (QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3)
values 
('What is the capital of France?', 'Paris', 'London', 'Berlin', 'Madrid'),
('Which planet is known as the Red Planet?', 'Mars', 'Venus', 'Jupiter', 'Saturn'),
('Who painted the Mona Lisa?', 'Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'),
('What is the largest mammal in the world?', 'Blue Whale', 'Elephant', 'Giraffe', 'Hippopotamus'),
('In which year did World War II end?', '1945', '1944', '1946', '1943'),
('What is the chemical symbol for gold?', 'Au', 'Ag', 'Fe', 'Cu'),
('Which Shakespeare play features the character Hamlet?', 'Hamlet', 'Macbeth', 'Romeo and Juliet', 'Othello'),
('What is the smallest prime number?', '2', '1', '3', '0'),
('Which ocean is the largest?', 'Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'),
('Who developed the theory of relativity?', 'Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla');

select * from users;