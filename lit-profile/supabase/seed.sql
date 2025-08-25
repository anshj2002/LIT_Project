-- Student
insert into public.students (id, full_name, institution, bio, avatar_url)
values (
  uuid_generate_v4(),
  'Ansh Jain',
  'XYZ Institute of Technology',
  'Final-year SDE — Python/React. Building data-heavy dashboards and real-time systems.',
  null
)
returning id \gset

-- Skills
insert into public.skills (student_id, name, level, endorsements_count, category, sort_order)
values
  (:id, 'Python', 90, 15, 'Programming', 1),
  (:id, 'React', 80, 12, 'Frontend', 2),
  (:id, 'PostgreSQL', 75, 10, 'Database', 3),
  (:id, 'FastAPI', 85, 11, 'Backend', 4);

-- Experience
insert into public.experiences (student_id, company, role, start_date, end_date, description, logo_url, sort_order)
values
  (:id, 'SGN Controls', 'SDE (Part-time)', '2025-07-01', null, 'Built monitoring dashboards and automation pipelines.', null, 1);

-- Interests
insert into public.interests (student_id, category, tag)
values
  (:id, 'Tech', 'IoT'),
  (:id, 'Tech', 'Robotics'),
  (:id, 'Hobbies', 'Badminton');

-- Endorsements
insert into public.endorsements (student_id, reviewer_name, reviewer_title, rating, comment, reviewer_avatar_url)
values
  (:id, 'Priya Sharma', 'Team Lead, SGN Controls', 5, 'Reliable and fast with clean code.', null),
  (:id, 'Rahul Verma', 'Senior Engineer', 5, 'Owns features end to end.', null);

-- Competitions / EPICs
insert into public.competitions (student_id, name, org, role, start_date, end_date, achievement, description, sort_order)
values
  (:id, 'Smart India Hackathon', 'Govt of India', 'Developer', '2024-08-01', '2024-08-15', 'Top 10 Finalist', 'Real-time analytics dashboard.', 1);

-- Feedback
insert into public.feedback (student_id, kind, text_content)
values
  (:id, 'text', 'Great collaboration and problem-solving.');

-- Highlights
insert into public.highlights (student_id, label, value, unit, trend, accent, sort_order)
values
  (:id, 'On-time Delivery', 98, '%', 'up', 'green', 1),
  (:id, 'Code Coverage', 82, '%', 'up', 'blue', 2);
